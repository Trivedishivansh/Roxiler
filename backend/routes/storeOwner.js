const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('Store Owner'));

router.get('/stores', storeOwnerController.getMyStores);
router.get('/stores/:storeId', storeOwnerController.getStoreDetails);

module.exports = router;