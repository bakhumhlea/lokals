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
  var inValid = false;

  if (isEmpty(req.body.business_name)) {
    errors.business_name = 'Please provide a business name';
    if (isEmpty(req.body.business_address) && isEmpty(req.body.business_zipcode)) {
      errors.business_address = 'Please provide street address or zipcode';
    }
    inValid = true;
  }
  if (inValid) {
    return res.status(400).json(errors);
  }

  const request = {
    input: `${req.body.business_name}, ${req.body.business_address}, ${req.body.business_zipcode}`,
    inputtype: 'textquery',
    fields: ['name', 'formatted_address', 'place_id', 'photos', 'types'],
  };
  googleMapsClient.findPlace(request, (err, response) => {
    if (response.json.status === "OK") {
      var result = response.json.candidates[0];
      return res.json(result);
    }
    return res.status(400).json(err);
  });
});

/**
 * @route GET api/business/findbusiness/google-place-id/:id
 * @desc Get business detail for business profile fields 
 * @access Private, Logged in user only
 * @TODO_NEXT Add passport.authenticate()
 */
router.get('/findbusiness/google-place-id/:id', (req, res) => {
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
 * @access Private, Logged in user only and must be Admin
 * @TODO_NEXT Add validation input
 */
router.post('/profile', passport.authenticate('jwt', { session: false }),(req, res) => {
  const errors = {};
  // const { errors, inValid } = validateBusinessDetailInput(req.body);
  
  // if (inValid) {
  //   return res.status(400).json(errors);
  // }
  // console.log(req.body.google_place_id);
  
  const businessFields = {};
  const address = {};
  businessFields.admin = req.user.id;
  if (req.body.business_name) businessFields.business_name = req.body.business_name.trim();
  if (req.body.street) address.street = req.body.street;
  if (req.body.city) address.city = req.body.city;
  if (req.body.country) address.country = req.body.country;
  if (req.body.state) address.state = req.body.state;
  if (req.body.zipcode) address.zipcode = req.body.zipcode;
  if (req.body.formatted_address) address.formatted_address = req.body.formatted_address;
  businessFields.address = address
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
 * @route GET api/business/profile
 * @desc Get business profile
 * @access Private, Logged in user only and must be admin
 * @TODO_NEXT Add validation input
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
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
router.post('/profile/id/:business_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  const businessID = req.params.business_id;
  const updateFields = {};
  if (req.body.business_name) updateFields.business_name = req.body.business_name;
  if (req.body.address) updateFields.formatted_address = req.body.address;
  if (req.body.categories) updateFields.categories = strToOfObj(req.body.categories, ",", "keyword");
  if (req.body.opening_hours) updateFields.opening_hours = req.body.opening_hours.split(',').map(el => getOpeningHours(el.trim()));
  if (req.body.business_type) updateFields.business_type = req.body.business_type;
  /** @TODO Others fields */
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.notfound = "Profile not found";
        return res.status(400).json(errors);
      }
      const admin = profile.administration;
      if ((admin.business_id.toString() !== businessID) || !admin.is_admin) {
        errors.administration = "You are not admin of this business";
        return res.status(400).json(errors);
      }
      updateFields.categories.forEach(category => {
        Category.findOne({ keyword: category.keyword }, (err, match) => {
          if (!match) {
            new Category(category).save();
          }
        })
      });
      Business.findByIdAndUpdate(
        { _id: businessID },
        { $set: updateFields },
        { new: true })
        .then(business => res.json(business))
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/business/id/:business_id/recommend
 * @desc Recommend business and remove id
 * @access Private, Logged in user only
 * @TODO_NEXT Add validation input
 */
router.post('/id/:business_id/recommend', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Business.findById({ _id: req.params.business_id })
    .then(business => {
      if (!business) {
        errors.notfound = "Business not found";
        return res.status(400).json(errors);
      }
      const recommendedBy = business.recommended;

      if (recommendedBy.map(recommended => recommended.user.toString()).includes(req.user.id)) {
        const removeIndex = recommendedBy.map(recommended => recommended.user.toString()).indexOf(req.user.id);
        recommendedBy.splice(removeIndex, 1);
        Business.findByIdAndUpdate(
          { _id: business._id},
          { $set: { recommended: recommendedBy }},
          { new: true })
          .then(b => res.json(b))
          .catch(err => res.status(400).json(err));
      } else {
        recommendedBy.unshift({ user: req.user.id });
        Business.findByIdAndUpdate(
          { _id: business._id},
          { $set: { recommended: recommendedBy }},
          { new: true })
          .then(b => res.json(b))
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err => res.status(400).json(err));
});

router.post('/id/:business_id/save', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Business.findById({ _id: req.params.business_id })
    .then(business => {
      if (!business) {
        errors.notfound = "Business not found";
        return res.status(400).json(errors);
      }
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          var collections = profile.collections;
          console.log(profile.collections);
          var businessIds = collections.map(collection => collection.business.toString());
          if (businessIds.includes(req.params.business_id)) {
            var removeIndex = businessIds.indexOf(req.params.business_id);
            collections.splice(removeIndex, 1);
            profile.collections = collections;
          } else {
            collections.unshift({ business_id: req.params.business_id });
            profile.collections = collections;
          }
          profile.save()
            .then(p => res.json({ collections: p.collections }))
            .catch(err => res.status(400).json(err));
        })
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;