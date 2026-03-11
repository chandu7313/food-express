const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');


const createRestaurant = asyncHandler(async (req, res) => {
    const { name, description, address, image } = req.body;

    const restaurant = await Restaurant.create({
        name,
        description,
        address,
        image,
    });

    if (restaurant) {
        res.status(201).json(restaurant);
    } else {
        res.status(400);
        throw new Error('Invalid restaurant data');
    }
});


const getRestaurants = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
});


const getRestaurantById = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
        res.json(restaurant);
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});


const updateRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
        restaurant.name = req.body.name || restaurant.name;
        restaurant.description = req.body.description || restaurant.description;
        restaurant.address = req.body.address || restaurant.address;
        restaurant.image = req.body.image || restaurant.image;
        restaurant.isActive = req.body.isActive !== undefined ? req.body.isActive : restaurant.isActive;

        const updatedRestaurant = await restaurant.save();
        res.json(updatedRestaurant);
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});


const deleteRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
        await restaurant.deleteOne();
        res.json({ message: 'Restaurant removed' });
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};
