const { errorResponder, errors } = require('../../../core/errors');
const { hashPassword, passwordMatched, hashOpaqueString } = require('../../../utils/password');
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
        throw errorResponder(errors.UNAUTHORIZED, "Incorrect login info");
    }

    if (!(await passwordMatched(password, user.password))) {
        throw errorResponder(errors.UNAUTHORIZED, "Incorrect login info");
    }

    const token = await generateRefreshToken();

    await repository.addRefreshToken(user, await hashOpaqueString(token));

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

async function refresh(refreshToken) {
    if (!refreshToken) {
        throw errorResponder(errors.UNAUTHORIZED, "Refresh token doesn't exist");
    }

    const tokenDocs = await repository.getToken(await hashOpaqueString(refreshToken));
    if (!tokenDocs)
        throw errorResponder(errors.UNAUTHORIZED, "Refresh token doesn't exist");

    const token = await generateRefreshToken();

    const u = await repository.getUserById(tokenDocs.userId);
    console.log(tokenDocs);
    console.log(u);

    await repository.addRefreshToken(u, await hashOpaqueString(token));

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