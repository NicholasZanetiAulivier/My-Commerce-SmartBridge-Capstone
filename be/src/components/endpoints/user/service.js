const { errorResponder, errors } = require('../../../core/errors');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { generateUserJwt, generateRefreshToken } = require('../../../utils/token');
const repository = require('./repository');


async function register(username, email, type, password) {
    const user = await repository.findUserByEmailOrUsername(email, username);
    if (user != null) {
        throw errorResponder(errors.USER_ALREADY_EXISTS);
    }

    const hashed = await hashPassword(password);
    const createdUser = await repository.saveUser({ username, email, type, password: hashed });

    const token = await generateUserJwt(createdUser);

    await repository.addRefreshToken(createdUser, await hashPassword(token));

    return {
        data: {
            id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
            type: createdUser.type
        },
        token: token
    };
}

async function login(email, password) {
    const user = await repository.findUserByEmailOrUsername(email, null);
    if (user == null) {
        throw errorResponder(errors.UNAUTHORIZED, 401, "Incorrect login info");
    }

    if (!(await passwordMatched(password, user.password))) {
        throw errorResponder(errors.UNAUTHORIZED, 401, "Incorrect login info");
    }

    const token = await generateRefreshToken();

    await repository.addRefreshToken(user, await hashPassword(token));

    return {
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            type: user.type,
            accessToken: await generateUserJwt(user)
        },
        token
    };
}

async function refresh(user, refreshToken) {
    if (!refreshToken) {
        throw errorResponder(errors.UNAUTHORIZED, 401, "Refresh token doesn't exist");
    }


    const u = await repository.getUserById(user.id);
    if (!u) {
        throw errorResponder(errors.NOT_FOUND, 404, "User not found", "User not found");
    }

    const tokens = await repository.getTokenByUserId(user.id);
    if (tokens.filter((a) => passwordMatched(refreshToken, a.token)).length < 1) {
        throw errorResponder(errors.TOKEN_EXPIRED, 401, "Refresh token is invalid or expired");
    }

    const token = await generateRefreshToken();

    await repository.addRefreshToken(u, await hashPassword(token));

    return {
        data: {
            accessToken: await generateUserJwt(u)
        },
        token
    };
}

async function getUsers(offset, limit, search) {
    let result;
    if (search) {
        result = await repository.searchAndPage(search, offset, limit);
    } else {
        result = await repository.findAndPage(offset, limit);
    }
    return {
        users: result,
        count: result.length,
        offset,
        limit,
        search: search || null
    };
}


module.exports = {
    register,
    refresh,
    getUsers,
    login
}