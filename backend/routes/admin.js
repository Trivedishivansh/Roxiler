const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { userValidation, storeValidation } = require('../middleware/validation');

router.use(authenticate, authorize('System Administrator'));

// User management
router.post('/users', userValidation.createUser, adminController.createUser);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);

// Store management
router.post('/stores', storeValidation.create, adminController.createStore);
router.get('/stores', storeValidation.search, adminController.getAllStores);

module.exports = router;