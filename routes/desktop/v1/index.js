/**
 * index.js
 * @description :: index route file of desktop platform.
 */

const express =  require('express');
const router =  express.Router();
router.use('/desktop/auth',require('./auth'));
router.use(require('./userRoutes'));
router.use(require('./productRoutes'));
router.use(require('./categoryRoutes'));
router.use(require('./orderRoutes'));
router.use(require('./bannerRoutes'));
router.use(require('./cartRoutes'));
router.use(require('./countryRoutes'));
router.use(require('./cityRoutes'));
router.use(require('./pincodeRoutes'));
router.use(require('./stateRoutes'));
router.use(require('./walletRoutes'));
router.use(require('./walletTransactionRoutes'));
router.use(require('./shippingRoutes'));

module.exports = router;
