const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true,
      trim: true
    },
    last: {
      type: String,
      required: true,
      trim: true
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('users', UserSchema);
