const { ObjectId } = require('mongodb');
const { Order } = require('../../../database');

async function hello() {
    // test.findOne({ ...}, { ...});
    return { "message": "hellow" };
}

async function getOrderListByUid(id, offset, limit) {
    return await Order.find({ _id: new ObjectId(id) }, {}, { skip: offset, limit });
}

module.exports = {
    hello,
    getOrderListByUid
}