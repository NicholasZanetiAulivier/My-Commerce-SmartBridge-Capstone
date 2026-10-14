const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.post('/', protect, controller.createOrder);
route.get('/', protect, controller.getHistory);

route.put('/cancel', protect, controller.hello);

route.put('/status', protect, controller.hello);

module.exports = route;