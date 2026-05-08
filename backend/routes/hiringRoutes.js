const express = require('express');
const router = express.Router();
const HiringApplication = require('../models/HiringApplication');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/hiring
// @desc    Submit hiring application (public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, position, resumeLink, portfolioLink, message } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    // Create application
    const application = await HiringApplication.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      position: position?.trim() || '',
      resumeLink: resumeLink?.trim() || '',
      portfolioLink: portfolioLink?.trim() || '',
      message: message?.trim() || '',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Hiring submission error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/hiring
// @desc    Get all hiring applications (admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { deletedAt: null };
    
    if (status) query.status = status;

    const applications = await HiringApplication.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await HiringApplication.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get hiring applications error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/hiring/:id/status
// @desc    Update application status (admin only)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await HiringApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error('Update hiring status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/hiring/:id
// @desc    Soft delete application (admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const application = await HiringApplication.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), deletedBy: req.user._id },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete hiring application error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
