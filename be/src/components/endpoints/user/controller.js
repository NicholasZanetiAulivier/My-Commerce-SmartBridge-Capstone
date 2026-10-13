const { processJoiValidationError, errorResponder, errors } = require('../../../core/errors');
const { cookieOptions } = require('../../../utils/token');
const service = require('./service');
const validate = require('../../middlewares/validator');
const { checkInteger } = require('../../../utils/checks');

async function register(req, res, next) {
    try {

        const { error, value } = validate.register(req.body);
        processJoiValidationError(error);
        const { username, email, type, password } = value;

        const { data, token } = await service.register(username, email, type, password);
        res.cookie("refreshToken", token, cookieOptions);
        return res.status(201).json(data);
    } catch (e) {
        return next(e);
    }
}

async function login(req, res, next) {
    try {
        const { error, value } = validate.login(req.body);
        processJoiValidationError(error);
        const { email, password } = value;

        const { data, token } = await service.login(email, password);
        res.cookie("refreshToken", token, cookieOptions);
        return res.status(200).json(data);
    } catch (e) {
        return next(e);
    }
}

async function refresh(req, res, next) {
    try {
        const { data, token } = await service.refresh(req.user, req.cookies['refreshToken']);
        res.cookie("refreshToken", token, cookieOptions);
        return res.status(200).json(data);
    } catch (e) {
        return next(e);
    }
}

async function getUsers(req, res, next) {
    try {
        let { offset, limit, search } = req.query;

        offset = checkInteger(offset, 0, Number.POSITIVE_INFINITY, 0);
        limit = checkInteger(limit, 0, 100, 10);
        const data = await service.getUsers(offset, limit, search);

        return res.status(200).json(data);
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    register,
    refresh,
    getUsers,
    login
}