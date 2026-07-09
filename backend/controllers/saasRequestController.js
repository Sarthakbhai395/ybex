const SaasRequest = require('../models/SaasRequest');

// @desc    Submit SaaS Beta Request
// @route   POST /api/saas-requests
const submitSaasRequest = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const saasRequest = await SaasRequest.create({
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
    });

    console.log('\n🚀 New SaaS Private Beta Request');
    console.log('────────────────────────────────');
    console.log(`  Email:   ${email}`);
    if (phone) console.log(`  Phone:   ${phone}`);
    console.log('────────────────────────────────\n');

    res.status(201).json({ success: true, message: 'Beta request submitted successfully', saasRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all SaaS Requests (admin only)
// @route   GET /api/saas-requests
const getAllSaasRequests = async (req, res, next) => {
  try {
    const saasRequests = await SaasRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: saasRequests.length, saasRequests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a SaaS Request (admin only)
// @route   PATCH /api/saas-requests/:id
const updateSaasRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isRead } = req.body;

    const saasRequest = await SaasRequest.findById(id);
    if (!saasRequest) {
      return res.status(404).json({ message: 'SaaS Request not found' });
    }

    if (status !== undefined) saasRequest.status = status;
    if (isRead !== undefined) saasRequest.isRead = isRead;

    await saasRequest.save();

    res.json({ success: true, saasRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a SaaS Request (admin only)
// @route   DELETE /api/saas-requests/:id
const deleteSaasRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const saasRequest = await SaasRequest.findByIdAndDelete(id);
    if (!saasRequest) {
      return res.status(404).json({ message: 'SaaS Request not found' });
    }

    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSaasRequest,
  getAllSaasRequests,
  updateSaasRequest,
  deleteSaasRequest,
};
