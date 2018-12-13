const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const APP = require('../../../util/app-default-value');
const passport = require('passport');

const User = require('../../../models/User');
const Profile = require('../../../models/Profile');

const isEmpty = require('../../../validation/is-empty');

// @route POST api/profile
// @desc Create and Edit Profile
// @access Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // const { errors, isValid } = validateProfileInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  const profileFields = {};
  
});

// @route GET api/profile/
// @desc Get Profile by UserID
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  // const id = req.params.profile_id;
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name','email'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = APP.ERRORS.PROFILE.NOT_FOUND;
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// @route GET api/profile/:profile_id
// @desc Get Profile by Profile ID
// @access Public
router.get('/:profile_id', (req, res) => {
  const errors = {};
  const id = req.params.profile_id;

  Profile.findById({ _id: id })
    .populate('user', [ 'name' ])
    .then(profile => {
      res.json(profile);
    })
    .catch(err => {
      errors.profile = APP.ERRORS.PROFILE.NOT_EXISTED(id);
      res.status(400).json(errors)
    });
});

// @route POST api/profile/preferences/categories
// @desc Add preferience categories
// @access Private
router.post('/preferences/categories', passport.authenticate('jwt', { session: false }), (req, res) => {
  const input = req.body.categories.split(' ');
  const profile = {preferences: []};
  input.forEach(element => {
    const category = {
      keyword: element
    };
    profile.preferences.push(category);
  });
  console.log(profile);
  Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profile },
    { new: true }
    ).then(profile => {
      res.json(profile);
    })
    .catch(err => {
      res.status(400).json(err);
    });
})

module.exports = router;