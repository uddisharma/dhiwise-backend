/**
 * shippingRoutes.js
 * @description :: CRUD API routes for shipping
 */

const express = require('express');
const router = express.Router();
const shippingController = require('../../../controller/desktop/v1/shippingController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/desktop/api/v1/shipping/create').post(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.addShipping);
router.route('/desktop/api/v1/shipping/list').post(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.findAllShipping);
router.route('/desktop/api/v1/shipping/count').post(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.getShippingCount);
router.route('/desktop/api/v1/shipping/:id').get(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.getShipping);
router.route('/desktop/api/v1/shipping/update/:id').put(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.updateShipping);    
router.route('/desktop/api/v1/shipping/partial-update/:id').put(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.partialUpdateShipping);
router.route('/desktop/api/v1/shipping/softDelete/:id').put(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.softDeleteShipping);
router.route('/desktop/api/v1/shipping/softDeleteMany').put(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.softDeleteManyShipping);
router.route('/desktop/api/v1/shipping/addBulk').post(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.bulkInsertShipping);
router.route('/desktop/api/v1/shipping/updateBulk').put(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.bulkUpdateShipping);
router.route('/desktop/api/v1/shipping/delete/:id').delete(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.deleteShipping);
router.route('/desktop/api/v1/shipping/deleteMany').post(auth(PLATFORM.DESKTOP),checkRolePermission,shippingController.deleteManyShipping);

module.exports = router;
