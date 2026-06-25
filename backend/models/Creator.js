const mongoose = require('mongoose');
const creatorSchema = new mongoose.Schema({
  name:               { type: String, required: true, trim: true },
  imageUrl:           { type: String, default: null },
  instagramFollowers: { type: String, default: '' },
  averageReach:       { type: String, default: '' },
  socialLink:         { type: String, default: '' },
  profileLink:        { type: String, default: '' },
  backgroundText:     { type: String, default: 'YBEX' },
  deletedAt:          { type: Date, default: null },
  deletedBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

creatorSchema.pre('save', function(next) {
  if (this.profileLink && !this.socialLink) {
    this.socialLink = this.profileLink;
  } else if (this.socialLink && !this.profileLink) {
    this.profileLink = this.socialLink;
  }
  next();
});

module.exports = mongoose.model('Creator', creatorSchema);
