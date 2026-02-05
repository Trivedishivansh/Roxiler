const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { storeValidation, ratingValidation } = require('../middleware/validation');

router.use(authenticate, authorize('Normal User'));

// Store browsing
router.get('/stores', storeValidation.search, userController.getAllStores);

// Rating operations
router.post('/ratings', ratingValidation.submit, userController.submitRating);
router.put('/ratings/:storeId', ratingValidation.update, userController.updateRating);

module.exports = router;