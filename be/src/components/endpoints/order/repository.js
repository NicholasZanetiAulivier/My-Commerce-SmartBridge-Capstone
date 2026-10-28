const { ObjectId } = require('mongodb');
const { Order, User, db } = require('../../../database');
const productRespository = require('../product/repository');

async function getOrderListByUid(id, offset, limit) {
    return await Order.find({ userId: new ObjectId(id) }, {}, { skip: offset, limit });
}

async function getAll(offset, limit) {
    return await Order.find({}, {}, { skip: offset, limit });
}

async function transactionOrdering(user, name, email, mobile, address, postCode, paymentMethod,) {
    const session = await db.startSession();
    const result = await session.withTransaction(async () => {
        const cart = user.cart;
        let products = await cart.map(async (i) => {
            const product = await productRespository.getById(i.productId.toString());
            return {
                qty: i.qty,
                productId: product._id,
                unitPrice: product.price,
                netPrice: product.price * i.qty,
                discount: product.discount
            };
        });
        products = await Promise.all(products);

        const newOrder = new Order({ userId: user._id, name, email, mobile, address, postCode, products, discount: 0, paymentMethod, orderDate: new Date(), orderStatus: 'pending' });
        await User.updateOne({ _id: user._id }, { $set: { cart: [] } });
        return newOrder.save();
    });
    await session.endSession();
    return result;
}

async function getOrderByUserIdAndId(uid, oid) {
    return await Order.findOne({ userId: new ObjectId(uid), _id: new ObjectId(oid) });
}

async function updateStatus(status, uid, oid) {
    return await Order.updateOne({ userId: new ObjectId(uid), _id: new ObjectId(oid) }, { orderStatus: status });
}

async function updateStatusByOrder(status, oid) {
    return await Order.updateOne({ _id: new ObjectId(oid) }, { orderStatus: status });
}

async function getOrderById(id) {
    return await Order.findOne({ _id: new ObjectId(id) });
}

module.exports = {
    getOrderListByUid,
    transactionOrdering,
    getOrderByUserIdAndId,
    updateStatus,
    getOrderById,
    updateStatusByOrder,
    getAll
}