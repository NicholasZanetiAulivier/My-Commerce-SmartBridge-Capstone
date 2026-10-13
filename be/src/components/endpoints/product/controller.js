const { errorResponder, errors, processJoiValidationError } = require('../../../core/errors');
const service = require('./service');
const { checkInteger } = require('../../../utils/checks');
const validate = require('../../middlewares/validator');

async function getProducts(req, res, next) {
    try {
        let { offset, limit, search, category } = req.query;

        offset = checkInteger(offset, 0, Number.POSITIVE_INFINITY, 0);
        limit = checkInteger(limit, 0, 100, 10);

        const results = await service.getProducts(offset, limit, search, category);

        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function getById(req, res, next) {
    try {
        let { id } = req.params;
        const results = await service.getById(id);

        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function createProduct(req, res, next) {
    try {
        if (req.user.type !== "admin") {
            throw errorResponder(errors.FORBIDDEN, "This can only be accessed by admins");
        }
        const { error, value } = validate.product(req.body);
        processJoiValidationError(error);
        const { title, description, mainImg, carousel, category, sizes, gender, price, discount } = value;

        const data = await service.createProduct(title, description, mainImg, carousel, category, sizes, gender, price, discount);
        return res.status(201).json(data);
    } catch (e) {
        return next(e);
    }
}

async function updateProduct(req, res, next) {
    try {
        if (req.user.type !== "admin") {
            throw errorResponder(errors.FORBIDDEN, "This can only be accessed by admins");
        }

        const { error, value } = validate.productUpdate(req.body);
        processJoiValidationError(error);
        const { title, description, mainImg, carousel, category, sizes, gender, price, discount } = value;

        const { id } = req.params;

        const data = await service.updateProduct(id, { title, description, mainImg, carousel, category, sizes, gender, price, discount });

        return res.status(200).json(data);
    } catch (e) {
        return next(e);
    }
}

async function getCategories(req, res, next) {
    try {
        const data = await service.getCategories();
        return res.status(200).json(data);
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    getProducts,
    getById,
    createProduct,
    updateProduct,
    getCategories
}