const { Product } = require('../../../database');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

async function searchAndPage(search, offset, limit) {
    return Product.find({ $text: { $search: search } }, { _id: 0, __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function findAndPage(offset, limit) {
    return Product.find({}, { _id: 0, __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

module.exports = {
    hello,
    searchAndPage,
    findAndPage
}