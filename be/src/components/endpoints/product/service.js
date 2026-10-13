const { errorResponder, errors } = require('../../../core/errors');
const repository = require('./repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function getProducts(offset, limit, search) {
    let result;
    if (search) {
        result = await repository.searchAndPageSimple(search, offset, limit);
    } else {
        result = await repository.findAndPageSimple(offset, limit);
    }
    return {
        products: result.map((e) => ({ title: e.title, description: e.description, mainImg: e.mainImg, id: e._id, category: e.category, price: e.price, discount: e.discount })),
        count: result.length,
        offset,
        limit,
        search: search || null
    };
}

async function getById(id) {
    try {
        const result = await repository.getById(id);
        if (!result)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Product not found")
    }
    return {
        title: result.title,
        description: result.description,
        mainImg: result.description,
        carousel: result.carousel,
        sizes: result.sizes,
        category: result.category,
        gender: result.gender,
        price: result.price,
        discount: result.discount,
        id: result._id
    };
}

module.exports = {
    hello,
    getProducts,
    getById
}