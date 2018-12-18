const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  admins: {
    user:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  name: {
    type: String,
    required: true
  },
  business_type: {
    type: String,
    default: 'restaurant'
  },
  formatted_address: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  opening_hours: [
    {
      close: {
        day: {
          type: Number
        },
        time: {
          type: Number
        }
      },
      open: {
        day: {
          type: Number
        },
        time: {
          type: Number
        }
      }
    }
  ],
  categories: [
    {
      keyword: {
        type: String
      }
    }
  ],
  recommended: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  talk_about: [
    {
      keyword: {
        type: String,
      }
    }
  ],
  events: [
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: 'events'
      }
    }
  ],
  stories: [
    {
      story: {
        type: Schema.Types.ObjectId,
        ref: 'stories'
      }
    }
  ],
  feature_in: [
    {
      list: {
        type: Schema.Types.ObjectId,
        ref: 'lists'
      }
    }
  ],
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Business = mongoose.model('businesses', BusinessSchema);