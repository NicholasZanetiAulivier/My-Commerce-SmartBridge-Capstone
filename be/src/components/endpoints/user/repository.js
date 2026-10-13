const { User, Token } = require('../../../database');

async function findUserByEmailOrUsername(email, username) {
    return User.findOne({ $or: [{ email }, { username }] });
}

async function saveUser({ username, email, password, type }) {
    const newUser = new User({ username, email, password, type });
    return newUser.save();
}

async function addRefreshToken(user, hashedToken) {
    const newToken = new Token({ createdAt: Date.now(), token: hashedToken, userId: user._id });
    return newToken.save();
}

async function getToken(token) {
    return Token.findOne({ token });
}

async function getUserById(userId) {
    return User.findOne({ _id: userId });
}

async function searchAndPage(search, offset, limit) {
    return User.find({ $or: [{ username: { $regex: new RegExp(search, "i") } }, { email: { $regex: new RegExp(search, "i") } }] }, { password: 0, __v: 0, cart: 0 }, { sort: { username: 1 }, skip: offset, limit: limit });
}

async function findAndPage(offset, limit) {
    return User.find({}, { password: 0, __v: 0, cart: 0 }, { sort: { username: 1 }, skip: offset, limit: limit });
}

module.exports = {
    findUserByEmailOrUsername,
    saveUser,
    addRefreshToken,
    getUserById,
    searchAndPage,
    findAndPage,
    getToken
}