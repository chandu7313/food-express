const express = require('express');
const {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/', placeOrder);
router.get('/user', getUserOrders);
router.get('/admin', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
