const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  claim_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = Business = mongoose.model('businesses', BusinessSchema);