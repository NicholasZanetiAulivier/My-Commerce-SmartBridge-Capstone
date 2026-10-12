const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.post('/update', protect, controller.hello);
route.get('/fetch', protect, controller.hello);
route.get('/', controller.hello);

module.exports = route;