const { errorResponder, errors } = require('../../../core/errors');
const repository = require('./repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function getProducts(offset, limit, search, category) {
    let result;
    if (search) {
        result = await repository.searchAndPageSimple(search, offset, limit, category);
    } else {
        result = await repository.findAndPageSimple(offset, limit, category);
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
    } catch (_e) {
        throw errorResponder(errors.NOT_FOUND, "Product not found")
    }
}

async function createProduct(title, description, mainImg, carousel, category, sizes, gender, price, discount) {
    const result = await repository.createProduct({ title, description, mainImg, carousel, category, sizes, gender, price, discount });
    if (!result)
        throw errorResponder(errors.DB, "Product was unable to be created");

    return {
        id: result._id,
        title: result.title,
        price: result.price
    };
}

async function updateProduct(id, { title, description, mainImg, carousel, category, sizes, gender, price, discount }) {
    let result;
    try {
        result = await repository.update(id, { title, description, mainImg, carousel, category, sizes, gender, price, discount });
    } catch (e) {
        console.log(e);
        throw errorResponder(errors.NOT_FOUND, "Product not found");
    }

    if (result.modifiedCount != 1) {
        throw errorResponder(errors.DB, "Product not updated");
    }

    return {
        id,
        updated: true,
        message: "Product updated"
    };
}

module.exports = {
    hello,
    getProducts,
    getById,
    createProduct,
    updateProduct
}