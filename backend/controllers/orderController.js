const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const placeOrder = asyncHandler(async (req, res) => {
    const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const order = new Order({
        userId: req.user._id,
        items,
        totalAmount,
        deliveryAddress,
        paymentMethod,
    });

    const createdOrder = await order.save();

    
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json(createdOrder);
});



const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});


const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
};
