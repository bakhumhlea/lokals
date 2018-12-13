const mongoose = require('mongoose');
const APP = require('../util/app-default-value');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  account_type: {
    type: String,
    default: APP.ACCOUNT_TYPE.STANDARD,
  },
  preferences: [
    {
      business_type: {
        type: String,
        default: 'restaurant'
      },
      keyword: {
        type: String
      }
    }
  ],
  collections: [
    {
      business_id: {
        type: String,
      },
      collected_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  saved_events: [
    {
      event_id: {
        type: String,
      },
      saved_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  administration: {
    is_admin: {
      type: Boolean,
      default: false,
    },
    business_id: {
      type: String,
    },
    upgraded: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: null
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
