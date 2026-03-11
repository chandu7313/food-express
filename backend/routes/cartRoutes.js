const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/add', addToCart);
router.get('/', getCart);
router.delete('/remove/:foodId', removeFromCart);

module.exports = router;
