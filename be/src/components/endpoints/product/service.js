const repository = require('./repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function getProducts(offset, limit, search) {
    let result;
    if (search) {
        result = await repository.searchAndPage(search, offset, limit);
    } else {
        result = await repository.findAndPage(offset, limit);
    }
    return {
        products: result,
        count: result.length,
        offset,
        limit,
        search: search || null
    };
}

module.exports = {
    hello,
    getProducts
}