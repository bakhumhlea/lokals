const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const APP = require('../../../util/app-default-value');
const passport = require('passport');
 
// Model
const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
// Validators
const validateSignUpInput = require('../../../validation/signup-validator');

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

// @rotue POST api/users/signup
// @desc Sign Up User
// @access Public
router.post('/signin', (req, res) => {
  // const { errors, isValid } = validateSignInInput(req.body);
  const errors = {};
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  
  const { email, password } = req.body;

  User.findOne({email: req.body.email})
    .then(user => {
      console.log(user);
      if (!user) {
        errors.email = APP.ERRORS.EMAIL.NOT_REGISTERED(email);
        return res.status(400).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // console.log(user._id);
            const payload = {
              id: user._id,
              name: user.name,
            }

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