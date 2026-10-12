const { User } = require('../../../database');

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

module.exports = {
    findUserByEmailOrUsername,
    saveUser,
    hello
}