const express = require('express');
const {
    createFoodItem,
    getFoodItemsByRestaurant,
    getAllFoodItemsByRestaurant,
    updateFoodItem,
    deleteFoodItem,
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only: returns ALL food items (available + unavailable). MUST be before /:restaurantId
router.route('/admin/:restaurantId').get(protect, admin, getAllFoodItemsByRestaurant).post(protect, admin, createFoodItem);

// Public: returns only available items for users
router.route('/:restaurantId').get(getFoodItemsByRestaurant);

// Admin CRUD on individual food items
router.route('/:id').put(protect, admin, updateFoodItem).delete(protect, admin, deleteFoodItem);

module.exports = router;
