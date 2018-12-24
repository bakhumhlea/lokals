const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

/** @desc Mongoose Model */
const Profile = require('../../models/Profile');
const Event = require('../../models/Event');
const Business = require('../../models/Business');

/** @desc Validation function */
const isEmpty = require('../../validation/is-empty');

/** @desc Utilities */ 
const APP = require('../../util/app-default-value');
const { capitalize, strToOfObj, getOpeningHours, byKeyword } = require('../../util/helpers');

/**
 * @route GET api/events/id/:event_id
 * @desc Get event detail for edit
 * @access Private, only Admin of Business
 */
router.get('/id/:event_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Event.findById({ _id: req.params.event_id })
    .populate('business', ['business_name','business_type','formatted_address'])
    .then(event => {
      if (isEmpty(event)) {
        errors.notfound = `Event's ID: ${req.params.event_id} does not exist`;
        return res.status(400).json(errors);
      }
      res.json(event)
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/events/ofbusiness/id/:business_id
 * @desc Create Events for spacific business id
 * @access Private, only Admin of Business
 */
router.post('/ofbusiness/id/:business_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  /**
   * @TODO Validation ['title','description','event_date.start','event_date.end','expired_at','categories','capacity']
   */
  const businessID = req.params.business_id;
  const eventFields = {};
  if (req.body.title) eventFields.title = req.body.title;
  if (req.body.subtitle) eventFields.subtitle = req.body.subtitle;
  if (req.body.description) eventFields.description = req.body.description;
  if (req.body.capacity) eventFields.capacity = req.body.capacity;
  if (req.body.ticket_needs === 1 && req.body.ticket_price && req.body.ticket_limit) eventFields.ticket = {
    needs: true,
    price: isNaN(parseInt(req.body.ticket_price, 10))?null:parseInt(req.body.ticket_price, 10),
    limit: isNaN(parseInt(req.body.ticket_limit, 10))?null:parseInt(req.body.ticket_limit, 10)
  };
  if (req.body.categories) eventFields.categories = strToOfObj(req.body.categories,",",'keyword');
  if (req.body.start && req.body.end) eventFields.event_date = { start: new Date(req.body.start) };
  if (req.body.expired_at) eventFields.expired_at = new Date(req.body.expired_at);

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const admin = profile.administration;
      if (!(admin.is_admin && (admin.business_id.toString() === businessID))) {
        errors.notadmin = "Your are not admin";
        return res.status(400).json(errors);
      }
      const newEvent = new Event(eventFields);
      newEvent.business = businessID;
      newEvent.admin = profile.user;
      if (req.body.end) newEvent.event_date.end = new Date(req.body.end);
      newEvent.save()
        .then(event => {
          if (isEmpty(event)) {
            errors.unsave = "Can't save event!, Please, Try again.";
            return errors;
          }
          Business.findById({ _id: event.business })
            .then(business => {
              if (!business) {
                errors.notfound = `Business with this ID:${event.business.toString()} is not found`;
                return res.status(400).json(errors);
              }
              var updatedEvents = business.events;
              console.log(event._id)
              updatedEvents.push({ event: event._id });
              Business.findByIdAndUpdate(
                { _id: event.business },
                { $set: { events: updatedEvents } },
                { new: true }
              ).then(b => res.json({
                ofbusiness: b.business_name,
                allevents: b.events,
                eventdetails: event,
              }).catch(err => res.status(400).json(err)));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route POST api/events/id/:event_id
 * @desc Update event detail
 * @access Private, only Admin of Business
 */
router.post('/id/:event_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  /**
   * @TODO Validation ['title','description','event_date.start','event_date.end','expired_at','categories','capacity']
   */
  const updatedFields = {};
  if (req.body.title) updatedFields.title = req.body.title;
  if (req.body.subtitle) updatedFields.subtitle = req.body.subtitle;
  if (req.body.description) updatedFields.description = req.body.description;
  if (req.body.capacity) updatedFields.capacity = req.body.capacity;
  console.log(typeof parseInt(req.body.ticket_price, 10));
  if (req.body.ticket_needs === '1' && req.body.ticket_price && req.body.ticket_limit) {
    updatedFields.ticket = {
      needs: true,
      price: isNaN(parseInt(req.body.ticket_price, 10))?null:parseInt(req.body.ticket_price, 10),
      limit: isNaN(parseInt(req.body.ticket_limit, 10))?null:parseInt(req.body.ticket_limit, 10)
    }
  } else {
    updatedFields.ticket = {
      needs: false,
      price: null,
      limit: null
    }
  };
  if (req.body.categories) updatedFields.categories = strToOfObj(req.body.categories,",",'keyword');
  if (req.body.start && req.body.end) updatedFields.event_date = { start: new Date(req.body.start) };
  if (req.body.expired_at) updatedFields.expired_at = new Date(req.body.expired_at);

  Event.findByIdAndUpdate(
    { _id: req.params.event_id },
    { $set: updatedFields},
    { new: true }
    ).then(event => {
      if (isEmpty(event)) {
        errors.notexisted = `Event's ID: ${req.params.event_id} does not exist`;
        return res.status(400).json(errors);
      }
      res.json(event)
    })
    .catch(err => res.status(400).json(err));
});

/**
 * @route DELETE api/events/id/:event_id/
 * @desc Delete event from database and remover from business list
 * @access Private, Logged in Users, bust bu admin of business
 */
router.delete('/id/:event_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  const id = req.params.event_id;

  Event.findById({ _id: id })
    .then(event => {
      if (!event) {
        errors.notfound = "Event not found";
        return res.status(400).json(errors);
      }
      Business.findById({ _id: event.business })
        .then(business => {
          const updatedEvents = business.events;
          const removeIndex = business.events.map(el => el.event.toString()).indexOf(id);
          updatedEvents.splice(removeIndex, 1);
          Business.where({ _id: event.business }).update({ $set: {events: updatedEvents}}).exec()
            .then(b => {
              Event.find().remove({ _id: id }, err => {
                if (err) {
                  return res.status(400).json(err);
                }
                return res.json({
                  success: `Event with this ID: ${id} has been deleted.`
                });
              });
            })
            .catch(err => res.status(400).json(err));
        })
    })
});
 
/**
 * @route POST api/events/id/:event_id/interested/
 * @desc Interest in event detail
 * @access Private, Logged in Users
 */
router.post('/id/:event_id/interested', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Event.findById({ _id: req.params.event_id })
    .then(event => {
      if (!event) {
        errors.notfound = "Event not found";
        return res.status(400).json(errors);
      }
      const interestedBy = event.interested_by;

      if (interestedBy.map(interested => interested.user.toString()).includes(req.user.id)) {
        const removeIndex = interestedBy.map(interested => interested.user.toString()).indexOf(req.user.id);
        interestedBy.splice(removeIndex, 1);
        Event.findByIdAndUpdate(
          { _id: event._id},
          { $set: { interested_by: interestedBy }},
          { new: true })
          .then(e => res.json(e))
          .catch(err => res.status(400).json(err));
      } else {
        interestedBy.unshift({ user: req.user.id });
        Event.findByIdAndUpdate(
          { _id: event._id},
          { $set: { interested_by: interestedBy }},
          { new: true })
          .then(e => res.json(e))
          .catch(err => res.status(400).json(err));
      }
      
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;