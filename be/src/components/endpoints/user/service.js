const { errorResponder, errors } = require('../../../core/errors');
const { hashPassword } = require('../../../utils/password');
const { generateUserJwt } = require('../../../utils/token');
const repository = require('./repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function register(username, email, type, password) {
    const user = await repository.findUserByEmailOrUsername(email, username);
    if (user != null) {
        throw errorResponder(errors.USER_ALREADY_EXISTS);
    }

    const hashed = await hashPassword(password);
    const createdUser = await repository.saveUser({ username, email, type, password: hashed });
    console.log(createdUser);

    const token = await generateUserJwt(createdUser);
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

module.exports = {
    register
}