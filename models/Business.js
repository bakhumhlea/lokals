const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  business_name: {
    type: String,
    required: true
  },
  business_type: {
    type: String,
    required: true
  },
  images: [
    {
      url: {
        type: String,
      },
      uploaded: {
        type: Date,
        default: Date.now
      }
    }
  ],
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipcode: {
      type: String,
      required: true
    },
    formatted_address: {
      type: String,
      required: true
    }
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
          type: String
        }
      },
      open: {
        day: {
          type: Number
        },
        time: {
          type: String
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
  approved: {
    status: {
      type: Boolean,
      default: false
    }
  },
  google_place_id: {
    type: String,
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = Business = mongoose.model('businesses', BusinessSchema);