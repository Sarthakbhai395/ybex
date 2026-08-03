const mongoose = require('mongoose');

const SchoolMentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mentor name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Mentor role is required'],
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  track: {
    type: String,
    enum: ['Content Creation', 'Digital Marketing', 'Growth & Strategy', 'Full Stack Creator'],
    default: 'Content Creation',
  },
  imageUrl: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: '',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  expertise: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('SchoolMentor', SchoolMentorSchema);
