const { errorResponder, errors } = require('../../../core/errors');
const repository = require('./repository');
const productRepository = require('../product/repository');
const userRepository = require('../user/repository');
const { response } = require('express');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function getCartByUserId(id) {
    let results;
    try {
        results = await repository.getCartByUserId(id);
    } catch (e) {
        console.log(e);
        throw errorResponder(errors.NOT_FOUND, "User not found!");
    }

    return {
        cart: results.cart || [],
        count: results.cart.length
    };
}

async function addToCart(id, { productId, qty }) {
    let results;
    try {
        const product = await productRepository.getById(productId);
        if (!product)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Product not found");
    }

    let cart = (await userRepository.getUserById(id)).cart;
    if (cart) {
        for (let i of cart) {
            if (i.productId.toString().toLowerCase() === productId.toLowerCase())
                throw errorResponder(errors.DB_DUPLICATE_CONFLICT, "Product already in cart. Use put to update qty");
        }
    }

    try {
        results = await repository.addToCart(id, productId, qty);
        if (results.modifiedCount < 1)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.DB, "Unable to add to cart. May be due to reaching max cart limit of 50");
    }
    return {
        message: "Successfully added to cart"
    };
}

async function modifyCartAmount(id, productId, qty) {
    try {
        const product = await productRepository.getById(productId);
        if (!product)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Product not found");
    }

    let u;
    try {
        u = await repository.getUserWithSpecificProductInCart(id, productId);
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "User not found");
    }

    if (!u)
        throw errorResponder(errors.NOT_FOUND, "Product isn't in cart");

    let res = await repository.updateUserCartQuantity(id, productId, qty);
    if (res.modifiedCount < 1) {
        throw errorResponder(errors.DB, "Failed to updated product quantity");
    }
    return {
        message: "Successfully updated cart quantity"
    };
}

async function deleteItem(id, productId) {
    try {
        const product = await productRepository.getById(productId);
        if (!product)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Product not found");
    }

    let u;
    try {
        u = await repository.getUserWithSpecificProductInCart(id, productId);
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "User not found");
    }
    if (!u)
        throw errorResponder(errors.NOT_FOUND, "Product isn't in cart");

    await repository.deleteFromCart(id, productId);
    return {
        message: "Successfully updated cart quantity"
    };
}

module.exports = {
    hello,
    getCartByUserId,
    addToCart,
    modifyCartAmount,
    deleteItem
}