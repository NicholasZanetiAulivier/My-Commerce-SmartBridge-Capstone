const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.get('/', protect, controller.hello);
route.post('/add', protect, controller.hello);
route.patch('/set-quantity', protect, controller.hello);

module.exports = route;