const mongoose = require('mongoose');

const saasRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SaasRequest', saasRequestSchema);
