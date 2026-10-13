const { ObjectId } = require('mongodb');
const { Product } = require('../../../database');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

async function searchAndPageSimple(search, offset, limit, category) {
    const q = { $text: { $search: search } }
    if (category) q['category'] = category;
    return Product.find(q, { carousel: 0, sizes: 0, gender: 0, __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function findAndPageSimple(offset, limit, category) {
    return Product.find(category ? { category } : {}, { carousel: 0, sizes: 0, gender: 0, __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function getById(id) {
    return Product.findOne({ _id: new ObjectId(id) }, { __v: 0 });
}

async function getByCategory(category) {
    return Product.findOne({ category });
}

async function createProduct({ title, description, mainImg, carousel, category, sizes, gender, price, discount }) {
    return (new Product({ title, description, mainImg, carousel, category, sizes, gender, price, discount })).save();
}

async function update(id, { title, description, mainImg, carousel, category, sizes, gender, price, discount }) {
    let update = {};
    if (title) update['title'] = title;
    if (description) update['description'] = description;
    if (mainImg) update['mainImg'] = mainImg;
    if (carousel) update['carousel'] = carousel;
    if (category) update['category'] = category;
    if (gender) update['gender'] = gender;
    if (sizes) update['sizes'] = sizes;
    if (price) update['price'] = price;
    if (discount) update['discount'] = discount;

    return await Product.updateOne({ _id: new ObjectId(id) }, update);
}

module.exports = {
    hello,
    searchAndPageSimple,
    findAndPageSimple,
    getById,
    getByCategory,
    createProduct,
    update
}