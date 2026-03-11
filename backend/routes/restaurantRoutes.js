const express = require('express');
const {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getRestaurants).post(protect, admin, createRestaurant);
router
    .route('/:id')
    .get(getRestaurantById)
    .put(protect, admin, updateRestaurant)
    .delete(protect, admin, deleteRestaurant);

module.exports = router;
