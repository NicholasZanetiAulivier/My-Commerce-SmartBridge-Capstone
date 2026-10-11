const { test } = require('../../../database');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

module.exports = {
    hello
}