const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');
const apiKey = require('../../config/google/keys');

/** @desc Mongoose Model */
const Profile = require('../../models/Profile');
const Business = require('../../models/Business');
const Category = require('../../models/Category');

/** @desc Validation function */
const isEmpty = require('../../validation/is-empty');

/** @desc Utilities */ 
const APP = require('../../util/app-default-value');
const { capitalize, strToOfObj, getOpeningHours, byKeyword } = require('../../util/helpers');

const googleMapsClient = require('@google/maps').createClient({
  key: apiKey.googleMapAPI,
  Promise: Promise
});

/**
 * @route GET api/business/search/:business_type/category/:keyword
 * @desc Search business by category's keyword
 * @access Public
 */
router.get('/search/category/:keyword', (req, res) => {
  const errors = {};
  // const businessType = req.params.business_type.split('-').join(' ');
  const keyword = req.params.keyword.split('-').join(' ');
  const keywordLength = keyword.length;
  Business
    .find()
    .where('categories.keyword').equals(keyword.toLowerCase())
    .then(businesses => {
      if (businesses.length > 0) {
        // const fields = ['business_name','formatted_address'];
        // const businessesWithFields = businesses.map(b => {
        //   var returnObj = fields.map(f => {
        //     return {
        //       [f]: b[f],
        //     }
        //   });
        //   return returnObj;
        // });
        // return res.json(businessesWithFields);
        return res.json(businesses);
      }
      errors.businessmatched = `No business matched to this keyword '${keyword}'`;
      Category.find()
        .then(categories => {
          if (keywordLength > 1) {
            var results = [];
            for (var n = keywordLength; n > 1; n--) {
              var mappedCategories = categories.map(category => category.keyword.substring(0, n));
              if (mappedCategories.includes(keyword.substring(0, n))) {
                mappedCategories.forEach((el, index) => {
                  if (el === keyword.substring(0, n)){
                    results.push(categories[index]);
                  }
                });
                break
              }
            }
            results.sort(byKeyword);
            if (!isEmpty(results)) {
              return res.json({ suggestion: results.map(result => result.keyword) });
            } else {
              errors.nocategorymatch = `No category matched to this keyword '${keyword}'`;
              return res.json(errors)
            }
          }
        })
        .catch(err => json.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/business/profile/findbusiness
 * @desc Find business you own by business name and address
 * @access Public
 */
router.post('/findbusiness', (req, res) => {
  const errors = {};
  const request = {
    input: `${req.body.business_name}, ${req.body.business_address}, ${req.body.business_zipcode}`,
    inputtype: 'textquery',
    fields: ['name', 'formatted_address', 'place_id'],
  };
  googleMapsClient.findPlace(request, (err, response) => {
    if (response.json.status === "OK") {
      return res.json(response.json.candidates[0])
    }
    res.status(400).json(err);
  });
});

/**
 * @route GET api/business/findbusiness/byid/:id
 * @desc Get business detail for business profile fields 
 * @access Private, Logged in user only
 * @TODO_NEXT Add passport.authenticate()
 */
router.get('/findbusiness/byid/:id', (req, res) => {
  const errors = {};
  const businessFields = {};
  const request = { 
    placeid: req.params.id,
    fields: APP.REQUEST.GOOGLEMAPS.PLACE.FIELDS
  };
  googleMapsClient.place(request)
    .asPromise()
    .then(response => {
      if(!response) {
        errors.thirdparty = "Third party request has failed";
        return res.json(errors);
      }
      const data = response.json.result;
      businessFields.name = data.name;
      businessFields.business_type = data.types[0];
      businessFields.categories = data.types.slice(0, 3);
      businessFields.formatted_address = data.formatted_address;
      businessFields.opening_hours = data.opening_hours.periods;
      businessFields.google_place_id = data.place_id;
      var openingHoursString = businessFields.opening_hours;
      
      console.log(openingHoursString.map(place => `${place.open.day}:${place.open.time}:${place.close.time}`).join(','));
      return res.json(businessFields);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

/**
 * @route POST api/business/profile/
 * @desc Create business profile and save in DB
 * @access Private, Logged in user only
 * @TODO_NEXT Add validation input
 */
router.post('/profile', passport.authenticate('jwt', { session: false }),(req, res) => {
  const errors = {};
  // const { errors, inValid } = validateBusinessDetailInput(req.body);
  
  // if (inValid) {
  //   return res.status(400).json(errors);
  // }
  // console.log(req.body.google_place_id);
  var businessFields = {};
  businessFields.admin = req.user.id;
  if (req.body.business_name) businessFields.business_name = req.body.business_name.trim();
  if (req.body.address) businessFields.formatted_address = req.body.address;
  if (req.body.categories) businessFields.categories = strToOfObj(req.body.categories, ",", "keyword");
  if (req.body.opening_hours) businessFields.opening_hours = req.body.opening_hours.split(',').map(el => getOpeningHours(el.trim()));
  businessFields.business_type = req.body.business_type? req.body.business_type : "restaurant";

  Business.findOne({ google_place_id: req.body.google_place_id })
    .then(business => {
      if (business) {
        errors.business = `${req.body.business_name}'s profile is already existed`;
        errors.message = "Is this the business you're looking for?";
        return res.status(400).json(errors);
      }
      googleMapsClient.place({ 
        placeid: req.body.google_place_id,
        fields: ['geometry', 'formatted_address', 'place_id']
      })
      .asPromise()
      .then(response => {
        if (response.json.status === "OK") {
          const data = response.json.result;
          businessFields.formatted_address = data.formatted_address;
          businessFields.google_place_id = data.place_id;
          businessFields.location = { 
            lat: data.geometry.location.lat, 
            lng: data.geometry.location.lng 
          };
          businessFields.categories.forEach(category => {
            Category.findOne({ keyword: category.keyword }, (err, match) => {
              console.log(match);
              if (!match) {
                new Category(category).save();
              }
            })
          });
          new Business(businessFields)
            .save()
            .then(business => {
              const adminProfile = {
                administration: {
                  is_admin: true,
                  business_id: business._id,
                  created_at: Date.now()
                }
              };
              Profile.findOneAndUpdate(
                { user : req.user.id },
                { $set: adminProfile },
                { new: true }
              )
              .then(profile => res.json({ new_admin: profile, new_business_profile: business }))
            });
        }
      });
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route GET api/business/profile/edit
 * @desc Get business profile for editing
 * @access Private, Logged in user only and must be admin
 * @TODO_NEXT Add validation input
 */
router.get('/profile/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        if (profile.administration.is_admin) {
          Business.findById({ _id: profile.administration.business_id })
            .then(business => {
              return res.json(business);
            })
            .catch(err => res.status(400).json(err));
        }
      }
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/business/profile/edit
 * @desc Updates profile and save in DB
 * @access Private, Logged in user only and must be admin
 * @TODO_NEXT Add validation input
 */
router.post('/profile/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const updateFields = {};
  if (req.body.business_name) updateFields.business_name = req.body.business_name;
  if (req.body.address) updateFields.formatted_address = req.body.address;
  if (req.body.categories) updateFields.categories = strToOfObj(req.body.categories, ",", "keyword");
  if (req.body.opening_hours) updateFields.opening_hours = req.body.opening_hours.split(',').map(el => getOpeningHours(el.trim()));
  if (req.body.business_type) updateFields.business_type = req.body.business_type;
  console.log(updateFields);
  console.log(req.body.business_id);
  Business.findByIdAndUpdate(
    { _id: req.body.business_id },
    { $set: updateFields },
    { new: true })
    .then(business => {
      return res.json(business);
    })
    .catch(err => res.status(400).json(err));
});
module.exports = router;