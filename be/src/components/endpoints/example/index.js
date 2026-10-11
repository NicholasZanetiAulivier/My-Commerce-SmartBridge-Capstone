const express = require(`express`);
const controller = require('./controller');

const route = express.Router();

//Paths
route.get('/signin', controller.hello);

module.exports = route;