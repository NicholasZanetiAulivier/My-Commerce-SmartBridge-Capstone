const repository = require('./repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

module.exports = {
    hello,
}