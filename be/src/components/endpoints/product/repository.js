const { ObjectId } = require('mongodb');
const { Product } = require('../../../database');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

async function searchAndPageSimple(search, offset, limit) {
    return Product.find({ $text: { $search: search } }, { carousel: 0, sizes: 0, gender: 0, __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function findAndPageSimple(offset, limit) {
    return Product.find({}, { carousel: 0, sizes: 0, gender: 0, __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function getById(id) {
    return Product.findOne({ _id: new ObjectId(id) }, { __v: 0 });
}

module.exports = {
    hello,
    searchAndPageSimple,
    findAndPageSimple,
    getById
}