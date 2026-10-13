const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.get('/:id', controller.getById);
route.get('/', controller.getProducts);
route.get('/categories', controller.hello);

route.put('/:id', protect, controller.updateProduct);
route.post('/', protect, controller.createProduct);

module.exports = route;