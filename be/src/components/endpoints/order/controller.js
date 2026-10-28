const service = require('./service');
const { checkInteger } = require('../../../utils/checks');
const validate = require('../../middlewares/validator');
const { processJoiValidationError, errorResponder, errors } = require('../../../core/errors');
const { getAll } = require('./repository');

async function getHistory(req, res, next) {
    try {
        let { offset, limit } = req.query;

        offset = checkInteger(offset, 0, Number.POSITIVE_INFINITY, 0);
        limit = checkInteger(limit, 0, 100, 10);

        const { id } = req.user;

        const results = await service.getHistory(id, offset, limit);
        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}
async function getAllUserOrders(req, res, next) {
    try {
        let { offset, limit } = req.query;

        offset = checkInteger(offset, 0, Number.POSITIVE_INFINITY, 0);
        limit = checkInteger(limit, 0, 100, 10);

        const { type } = req.user;
        if (type !== 'admin') throw errorResponder(errors.FORBIDDEN, "Only admins can access this function");


        const results = await service.getAll(offset, limit);
        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function createOrder(req, res, next) {
    try {
        const { error, value } = validate.orderCreation(req.body);
        processJoiValidationError(error);
        const { name, email, mobile, address, postCode, paymentMethod, } = value;

        const { id } = req.user;
        const results = await service.createOrder(id, name, email, mobile, address, postCode, paymentMethod,);
        return res.status(201).json(results);
    } catch (e) {
        return next(e);
    }
}

async function cancel(req, res, next) {
    try {
        const status = 'cancel';

        const { id } = req.params;
        const { id: uid, type } = req.user;
        if (type !== 'user') throw errorResponder(errors.FORBIDDEN, "Only users can access this function");

        const results = await service.cancel(status, id, uid);
        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function updateStatus(req, res, next) {
    try {
        const { error, value } = validate.orderStatus(req.body);
        processJoiValidationError(error);
        const { status } = value;

        const { id } = req.params;
        const { type } = req.user;
        if (type !== 'admin') throw errorResponder(errors.FORBIDDEN, "Only admins can access this function");

        const results = await service.updateStatus(status, id);
        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function completed(req, res, next) {
    try {
        const status = 'cancel';

        const { id } = req.params;
        const { id: uid, type } = req.user;
        if (type !== 'user') throw errorResponder(errors.FORBIDDEN, "Only users can access this function");

        const results = await service.cancel(status, id, uid);
        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    getAllUserOrders,
    getHistory,
    createOrder,
    cancel,
    updateStatus,
    completed
}