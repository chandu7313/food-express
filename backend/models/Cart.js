const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
                quantity: { type: Number, required: true, default: 1 },
            },
        ],
        totalAmount: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
