const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const APP = require('../../../util/app-default-value');
const passport = require('passport');
const apiKey = require('../../../config/google/keys');

const Business = require('../../../models/Business');
const Category = require('../../../models/Category');

const isEmpty = require('../../../validation/is-empty');

const googleMapsClient = require('@google/maps').createClient({
  key: apiKey.googleMapAPI,
  Promise: Promise
});

// @route GET api/business/profile/search/:business_type/category/:keyword
// @desc Search business by category's keyword
// @access Public
router.get('/search/:business_type/category/:keyword', (req, res) => {
  const errors = {};
  const businessType = req.params.business_type.split('-').join(' ');
  const keyword = req.params.keyword.split('-').join(' ');
  Business
    .find({ business_type: businessType })
    .where('categories.keyword').equals(keyword)
    .then(business => {
      if (!business) {
        errors.business = `No ${businessType} matched to this keyword: ${keyword}`;
        return res.json(errors);
      }
      console.log(business);
      res.json(business);
    })
    .catch(err => res.status(400).json(err));
})


// @route POST api/business/profile/
// @desc Create business profile
// @access Private
router.post('/', (req, res) => {
  const errors = {};
  if (isEmpty(req.body.name) || isEmpty(req.body.categories)) {
    errors.businessAddress = "Address is required!";
    return res.json(errors);
  }

  const businessFields = {};
  businessFields.name = req.body.name.trim().split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ');
  businessFields.categories = req.body.categories.split(',').map(keyword => { return { keyword: keyword.trim() } });
  
  const geocodeRequest = {
    address: businessFields.name
  };

  Business.findOne({ name: req.body.name })
    .then(business => {
      if (business) {
        errors.business = `${req.body.name}'s profile is already existed`;
        return res.json(errors);
      }
      googleMapsClient.geocode(geocodeRequest, (err, response) => {
        if (!err) {
          const placeid = response.json.results[0].place_id;

          googleMapsClient.place({
            placeid: placeid,
            fields: APP.REQUEST.GOOGLEMAPS.PLACE.FIELDS
          }, (err, response) => {
            if(err) {
              return res.json(err);
            }
            const data = response.json.result;
            businessFields.formatted_address = data.formatted_address;
            businessFields.location = { 
              lat: data.geometry.location.lat, 
              lng: data.geometry.location.lng 
            };
            businessFields.opening_hours = data.opening_hours.periods;

            new Business(businessFields)
              .save()
              .then(business => {
                res.json(business);
              })
              .catch(err => res.status(400).json(err));
            // return res.json(data);
            
          });
        }
      });
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;