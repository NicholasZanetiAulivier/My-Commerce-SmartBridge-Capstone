const { processJoiValidationError, errorResponder, errors } = require('../../../core/errors');
const { cookieOptions } = require('../../../utils/token');
const service = require('./service');
const validate = require('../../middlewares/validator');

async function register(req, res, next) {
    try {

        const { error, value } = validate.register(req.body);
        processJoiValidationError(error);
        const { username, email, type, password } = value;

        const { data, token } = await service.register(username, email, type, password);
        res.cookie("refreshToken", token, cookieOptions);
        res.status(201).json(data);
    } catch (e) {
        next(e);
    }
}

async function login(req, res, next) {
    try {
        const { error, value } = validate.login(req.body);
        processJoiValidationError(error);
        const { email, password } = value;

        const { data, token } = await service.login(email, password);
        res.cookie("refreshToken", token, cookieOptions);
        res.status(200).json(data);
    } catch (e) {
        next(e);
    }
}

async function refresh(req, res, next) {
    try {
        const { data, token } = await service.refresh(req.user, req.cookies['refreshToken']);
        res.cookie("refreshToken", token, cookieOptions);
        console.log(data);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
}

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

module.exports = {
    register,
    hello,
    refresh,
    login
}