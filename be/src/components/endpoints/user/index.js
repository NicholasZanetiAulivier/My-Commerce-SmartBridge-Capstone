const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');

const route = express.Router();

//Paths
route.post('/register', controller.register);
route.post('/login', controller.login);
route.post('/refresh', protect, controller.refresh);


route.get('/', protect, controller.getUsers);

module.exports = route;