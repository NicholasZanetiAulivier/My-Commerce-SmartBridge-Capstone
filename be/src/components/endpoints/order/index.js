const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.post('/', protect, controller.createOrder);
route.get('/', protect, controller.getHistory);

route.get('/all', protect, controller.getAllUserOrders);
route.patch('/cancel/:id', protect, controller.cancel);
route.patch('/completed/:id', protect, controller.completed);
route.patch('/status/:id', protect, controller.updateStatus);

module.exports = route;