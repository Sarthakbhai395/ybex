const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  role:      { type: String, required: true, trim: true },
  followers: { type: String, default: '' },
  quote:     { type: String, required: true, trim: true },
  stars:     { type: Number, default: 5 },
  avatar:    { type: String, default: null }, // base64 string
  since:     { type: String, default: 'Since 2022' },
  published: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
