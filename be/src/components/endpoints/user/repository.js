const { errorResponder, errors } = require('../../../core/errors');
const { User } = require('../../../database');
const { hashPassword } = require('../../../utils/password');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

async function findUserByEmailOrUsername(email, username) {
    return User.findOne({ $or: [{ email }, { username }] });
}

async function saveUser({ username, email, password, type }) {
    const newUser = new User({ username, email, password, type });
    return newUser.save();
}

async function addRefreshToken(user, hashedToken) {
    const res = await User.updateOne({ _id: user._id }, { $push: { refreshTokens: { createdAt: Date.now(), token: hashedToken } } });
    if (!res.acknowledged || res.modifiedCount < 1) {
        throw errorResponder(errors.DB);
    }
    return;
}

async function getUserById(userId) {
    return User.findOne({ _id: userId });
}

module.exports = {
    findUserByEmailOrUsername,
    saveUser,
    addRefreshToken,
    getUserById,
    hello
}