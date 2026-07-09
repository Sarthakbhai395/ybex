const express = require('express');
const {
  submitSaasRequest,
  getAllSaasRequests,
  updateSaasRequest,
  deleteSaasRequest,
} = require('../controllers/saasRequestController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitSaasRequest);
router.get('/', protect, adminOnly, getAllSaasRequests);
router.patch('/:id', protect, adminOnly, updateSaasRequest);
router.delete('/:id', protect, adminOnly, deleteSaasRequest);

module.exports = router;
