const asyncHandler = require('express-async-handler');
const FoodItem = require('../models/FoodItem');


const createFoodItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, image } = req.body;
    const restaurantId = req.params.restaurantId;

    const foodItem = await FoodItem.create({
        restaurantId,
        name,
        image,
        price,
        category,
    });

    if (foodItem) {
        res.status(201).json(foodItem);
    } else {
        res.status(400);
        throw new Error('Invalid food item data');
    }
});


const getFoodItemsByRestaurant = asyncHandler(async (req, res) => {
    const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId, isAvailable: true });
    res.json(foodItems);
});


const getAllFoodItemsByRestaurant = asyncHandler(async (req, res) => {
    const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId });
    res.json(foodItems);
});


const updateFoodItem = asyncHandler(async (req, res) => {
    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
        foodItem.name = req.body.name || foodItem.name;
        foodItem.price = req.body.price || foodItem.price;
        foodItem.category = req.body.category || foodItem.category;
        foodItem.image = req.body.image || foodItem.image;
        foodItem.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : foodItem.isAvailable;

        const updatedFoodItem = await foodItem.save();
        res.json(updatedFoodItem);
    } else {
        res.status(404);
        throw new Error('Food item not found');
    }
});


const deleteFoodItem = asyncHandler(async (req, res) => {
    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
        await foodItem.deleteOne();
        res.json({ message: 'Food item removed' });
    } else {
        res.status(404);
        throw new Error('Food item not found');
    }
});

module.exports = {
    createFoodItem,
    getFoodItemsByRestaurant,
    getAllFoodItemsByRestaurant,
    updateFoodItem,
    deleteFoodItem,
};
