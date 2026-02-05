const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

router.post('/register', userValidation.register, authController.register);
router.post('/login', userValidation.login, authController.login);
router.put('/password', authenticate, userValidation.updatePassword, authController.updatePassword);
router.get('/dashboard', authenticate, authController.getDashboardStats);

module.exports = router;