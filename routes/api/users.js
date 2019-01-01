const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const verifyClientId = require('../../util/verifyClientId')
 
// Model
const User = require('../../models/User');
const Profile = require('../../models/Profile');
// Validators
const validateSignUpInput = require('../../validation/signup-validator');
const validateSignInInput = require('../../validation/signin-validator');

// Utilities
const APP = require('../../util/app-default-value');

router.post('/signup/google/:token_id', (req,res) => {
  const errors = {};

  verifyClientId(req.params.token_id)
    .then(payload => {
      if (payload.errors) {
        return res.status(400).json(payload);
      }
      User.findOne({ email: payload.email })
        .then(user => {
          if (!user) {
            console.log(payload);
            var newUser = new User({
              name: {
                first: payload.given_name,
                last: payload.family_name,
              },
              email: payload.email,
              emailAuth: {
                password_required: false
              },
              googleAuth:{
                in_used: true,
                id: payload.sub
              }
            });
            newUser.save()
              .then(user => {
                new Profile({
                  user: user._id,
                  imageUrl: payload.picture
                }).save()
                .then(profile => {
                  const payload = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    imageUrl: profile.imageUrl
                  };
                  jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
                    return res.json({
                      success: true,
                      token: `${APP.TOKEN.BEARER} ${token}`
                    });
                  });
                })
              })
              .catch(err => res.status(400).json(err));
          }
          if (user && user.googleAuth.in_used && (payload.sub.toString() === user.googleAuth.id)) {
            Profile.findOne({ user: user._id })
              .then(profile => {
                const payload = {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  imageUrl: profile.imageUrl
                }
                jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
                  return res.json({
                    success: true,
                    token: `${APP.TOKEN.BEARER} ${token}`
                  });
                });
              })
              .catch(err => res.status(400).json(err));
          } else {
            errors.userexisted = `${payload.email} has been registered in our database. Try login with your Email and Password.`
            return res.status(400).json(errors);
          }
        })
    })
    .catch(err => res.json(err));
})
// @rotue POST api/users/signup
// @desc Sign Up User
// @access Public
router.post('/signup', (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = APP.ERRORS.EMAIL.EXISTED;
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          name: {
            first: req.body.first,
            last: req.body.last
          },
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const newProfile = new Profile({ user: user._id });
                newProfile
                  .save()
                  .then(profile => res.json({
                    user: user,
                    profile: profile
                  }));
              })
              .catch(err => console.log("Error: " + err));
          });
        });
      }
    });
});

// @rotue POST api/users/signin
// @desc Sign Up User
// @access Public
router.post('/signin', (req, res) => {
  const { errors, isValid } = validateSignInInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  const { email, password } = req.body;

  User.findOne({email: req.body.email})
    .then(user => {
      // console.log(user);
      if (!user) {
        errors.login = APP.ERRORS.LOGIN.INVALID_CREDENTIAL;
        return res.status(400).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // console.log(user._id);
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email
            };
            jwt.sign(payload, keys.secretOrKey, { expiresIn: APP.TOKEN.EXPIRES_IN }, (err, token) => {
              res.json({
                success: true,
                token: `${APP.TOKEN.BEARER} ${token}`
              });
            });
          } else {
            errors.password = APP.ERRORS.PASSWORD.INCORRECT;
            return res.status(400).json(errors);
          }
        });
    });
});

router.post

// @rotue GET api/users/current
// @desc Get Current User
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;