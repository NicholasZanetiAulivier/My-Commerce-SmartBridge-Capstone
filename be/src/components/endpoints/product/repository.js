const { ObjectId } = require('mongodb');
const { Product } = require('../../../database');

async function searchAndPageSimple(search, offset, limit, category) {
    const regex = new RegExp(search, "i");
    const q = { $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }, { category: { $regex: regex } }] }
    if (category) q['category'] = category;
    q['active'] = true;
    return Product.find(q, { __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function findAndPageSimple(offset, limit, category) {
    return Product.find(category ? { category, active: true } : { active: true }, { __v: 0 }, { sort: { title: 1 }, skip: offset, limit: limit });
}

async function getById(id) {
    return Product.findOne({ _id: new ObjectId(id), active: true }, { __v: 0 });
}

async function getByCategory(category) {
    return Product.findOne({ category, active: true });
}

async function createProduct({ title, description, mainImg, category, price, discount }) {
    return (new Product({ title, description, mainImg, category, price, discount, active: true })).save();
}

async function update(id, { title, description, mainImg, category, price, discount }) {
    let update = {};
    if (title) update['title'] = title;
    if (description) update['description'] = description;
    if (mainImg) update['mainImg'] = mainImg;
    if (category) update['category'] = category;
    if (!Number.isNaN(price)) update['price'] = price;
    if (!Number.isNaN(discount)) update['discount'] = discount;
    console.log(update);

    return await Product.updateOne({ _id: new ObjectId(id), active: true }, { $set: update });
}

async function getCategories() {
    return await Product.aggregate([
        { $match: { active: true } },
        { $sort: { category: 1 } },
        { $group: { _id: "$category" } }
    ]);
}

async function setInactive(id) {
    return await Product.updateOne({ _id: new ObjectId(id) }, { active: false });
}

module.exports = {
    searchAndPageSimple,
    findAndPageSimple,
    getById,
    getByCategory,
    createProduct,
    update,
    getCategories,
    setInactive
}