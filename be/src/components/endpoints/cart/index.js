const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.get('/', protect, controller.getCart);
route.post('/', protect, controller.addToCart);
route.put('/set-quantity/:productId', protect, controller.setQuantity);
route.delete('/:productId', protect, controller.deleteItemFromCart);

module.exports = route;