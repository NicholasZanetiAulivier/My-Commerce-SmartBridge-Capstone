const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.post('/', protect, controller.hello);

route.patch('/set-quantity', protect, controller.hello);
route.put('/cancel', protect, controller.hello);
route.get('/', protect, controller.getHistory);

route.put('/status', protect, controller.hello);

module.exports = route;