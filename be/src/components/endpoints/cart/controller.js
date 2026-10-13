const service = require('./service');
const validate = require('../../middlewares/validator');
const { processJoiValidationError, errorResponder, errors } = require('../../../core/errors');

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

async function getCart(req, res, next) {
    try {
        const { id } = req.user;

        const results = await service.getCartByUserId(id);

        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function addToCart(req, res, next) {
    try {
        const { error, value } = validate.cartAdd(req.body);
        processJoiValidationError(error);
        const { productId, qty } = value;

        const { id } = req.user;
        const results = await service.addToCart(id, { productId, qty });
        return res.status(201).json(results);

    } catch (e) {
        return next(e);
    }
}

async function setQuantity(req, res, next) {
    try {
        const { error, value } = validate.cartQuantity(req.body);
        processJoiValidationError(error);
        const { qty } = value;
        const { productId } = req.params;
        const { id } = req.user;

        const results = await service.modifyCartAmount(id, productId, qty);
        return res.status(200).json(results);
    } catch (e) {
        return next(e);
    }
}

async function deleteItemFromCart(req, res, next) {
    try {
        const { productId } = req.params;
        const { id } = req.user;

        const results = await service.deleteItem(id, productId);
        return res.status(200).json(results);

    } catch (e) {
        return next(e);
    }
}

module.exports = {
    hello,
    getCart,
    addToCart,
    setQuantity,
    deleteItemFromCart
}