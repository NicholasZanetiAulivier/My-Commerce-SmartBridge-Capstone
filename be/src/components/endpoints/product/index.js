const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.get('/categories', controller.getCategories);
route.get('/:id', controller.getById);
route.get('/', controller.getProducts);

route.put('/:id', protect, controller.updateProduct);
route.post('/', protect, controller.createProduct);

module.exports = route;