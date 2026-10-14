const service = require('./service');
const { checkInteger } = require('../../../utils/checks');
const validate = require('../../middlewares/validator');
const { processJoiValidationError } = require('../../../core/errors');

async function hello(req, res, next) {
    try {
        // const { username, password } = req.body;

        // if (username === undefined) {
        //     throw errorResponder(errors.NO_ARGUMENT, "Argument 'username' is not supplied");
        // }
        // if (password === undefined) {
        //     throw errorResponder(errors.NO_ARGUMENT, "Argument 'password' is not supplied");
        // }

        // const userRows = await service.getUser(username);

        // if (userRows.length > 0) {
        //     const user = userRows[0];
        //     const result = bcrypt.compareSync(password, user.password);
        //     if (!result) {
        //         throw errorResponder(errors.INVALID_CREDENTIALS, "Password does not match credentials");
        //     }
        //     const token = jwt.sign(
        //         {
        //             username,
        //             password,
        //         },
        //         process.env.SECRET_KEY,
        //         { expiresIn: "1h" },
        //     );
        //     return res.status(200).json({ token });
        // } else {
        //     throw errorResponder(errors.INVALID_CREDENTIALS, "User does not exist");
        // }

        const results = await service.hello();
        return res.status(200).json({ results });
    } catch (err) {
        return next(err);
    }
}

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

module.exports = {
    hello,
    getHistory,
    createOrder
}