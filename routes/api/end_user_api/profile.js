const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const APP = require('../../../util/app-default-value');
const passport = require('passport');

const User = require('../../../models/User');
const Profile = require('../../../models/Profile');
const Category = require('../../../models/Category');

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

// @route GET api/profile/user-id/:profile_id
// @desc Get Profile by Profile ID
// @access Public
router.get('/uid/:profile_id', (req, res) => {
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

// @route GET api/profile/preferences/categories
// @desc Get user preferences categories
// @access Private

router.get('/preferences/keywords', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const currentUserPreferences = profile.preferences.map(category => category.keyword);
      res.json(currentUserPreferences);
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

// @route POST api/profile/preferences/
// @desc Add preference by category id
// @access Private
router.post('/preferences', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const ofCategoryID = req.body.category_id.split(',');

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = "Profile not found";
        return res.json(errors);
      }
      var currentUserPreferences = profile.preferences.map(preference => preference.category.toString());
      ofCategoryID.forEach(id => {
        if (!currentUserPreferences.includes(id.trim())) {
          profile.preferences.push({ category: id.trim() });
        }
      });
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));

});

// @route GET api/profile/preferences/
// @desc Get user preferences categories
// @access Private
router.get('/preferences', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('preferences.category', ['keyword'])
    .then(profile => {
      if (!profile) {
        errors.profile = "Oops! Something wrong while fetching your profile";
        return res.json(errors);
      }
      res.json(profile.preferences);
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;