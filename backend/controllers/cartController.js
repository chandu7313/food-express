const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');


const addToCart = asyncHandler(async (req, res) => {
    const { foodId, quantity } = req.body;
    const userId = req.user._id;

    console.log(`[Cart] addToCart called: userId=${userId}, foodId=${foodId}, quantity=${quantity}`);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({ userId, items: [], totalAmount: 0 });
        console.log(`[Cart] Created new cart for user=${userId}`);
    }

    const foodItem = await FoodItem.findById(foodId);
    if (!foodItem) {
        console.error(`[Cart] Food item not found: ${foodId}`);
        res.status(404);
        throw new Error('Food item not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ foodId, quantity });
    }


    let total = 0;
    for (let item of cart.items) {
        const food = await FoodItem.findById(item.foodId);
        if (food) total += food.price * item.quantity;
    }
    cart.totalAmount = total;

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.foodId');
    console.log(`[Cart] Cart updated successfully for user=${userId}`);
    res.status(200).json(populatedCart);
});


const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
    if (!cart) {
        return res.json({ items: [], totalAmount: 0 });
    }
    res.json(cart);
});


const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const foodId = req.params.foodId;

    let cart = await Cart.findOne({ userId });

    if (cart) {
        cart.items = cart.items.filter((item) => item.foodId.toString() !== foodId);

        
        let total = 0;
        for (let item of cart.items) {
            const food = await FoodItem.findById(item.foodId);
            total += food.price * item.quantity;
        }
        cart.totalAmount = total;

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.foodId');
        res.json(populatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

module.exports = { addToCart, getCart, removeFromCart };
