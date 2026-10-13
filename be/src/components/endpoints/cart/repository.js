const { ObjectId } = require('mongodb');
const { User } = require('../../../database');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

async function getCartByUserId(id) {
    return await User.findOne({ _id: new ObjectId(id) }, { "cart._id": 0 });
}

async function addToCart(uid, productId, qty) {
    return await User.updateOne({ _id: new ObjectId(uid) }, { $push: { cart: { productId, qty } } });
}

async function getUserWithSpecificProductInCart(uid, productId) {
    return await User.findOne({ _id: new Object(uid), "cart.productId": new ObjectId(productId) },);
}

async function updateUserCartQuantity(uid, productId, qty) {
    return await User.updateOne({ _id: new Object(uid), "cart.productId": new ObjectId(productId) }, { "cart.$.qty": qty });
}


async function deleteFromCart(uid, productId) {
    return await User.updateOne({ _id: new Object(uid) }, { $pull: { cart: { productId: new ObjectId(productId) } } });
}

module.exports = {
    hello,
    getCartByUserId,
    addToCart,
    getUserWithSpecificProductInCart,
    updateUserCartQuantity,
    deleteFromCart
}