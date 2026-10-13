const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.get('/', controller.getProducts);
route.get('/:id', controller.hello);
route.get('/categories', controller.hello);

route.post('/', protect, controller.hello);
route.put('/:id', protect, controller.hello);

module.exports = route;