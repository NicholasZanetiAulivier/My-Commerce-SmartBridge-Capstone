const { errorResponder, errors } = require('../../../core/errors');
const repository = require('./repository');
const userRepository = require('../user/repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function getHistory(id, offset, limit) {
    let results;
    try {
        results = await repository.getOrderListByUid(id, offset, limit);
    } catch (e) {
        console.log(e);
        throw errorResponder(errors.NOT_FOUND, "User not found");
    }

    return {
        data:
            results.map((e) => (
                {
                    orderDetails: {
                        id: e._id,
                        name: e.name,
                        email: e.email,
                        mobile: e.mobile,
                        address: e.address,
                        postCode: e.postCode
                    },
                    products: e.products.map((p) => ({
                        productId: p.productId,
                        qty: p.qty,
                        unitPrice: p.unitPrice,
                        netPrice: p.netPrice,
                        discount: p.discount
                    })),
                    orderDate: e.orderDate,
                    deliveryDate: e.deliveryDate,
                    paymentMethod: e.paymentMethod,
                    status: e.orderStatus
                }
            )) || [],
        count: results.length
    };
}

async function getAll(offset, limit) {
    let results = await repository.getAll(offset, limit);
    return {
        data:
            results.map((e) => (
                {
                    userId: e.userId,
                    orderDetails: {
                        id: e._id,
                        name: e.name,
                        email: e.email,
                        mobile: e.mobile,
                        address: e.address,
                        postCode: e.postCode
                    },
                    products: e.products.map((p) => ({
                        productId: p.productId,
                        qty: p.qty,
                        unitPrice: p.unitPrice,
                        netPrice: p.netPrice,
                        price: p.price,
                        discount: p.discount
                    })),
                    totalPrice: e.products.reduce((p1, p2) => p1.price + p2.price, 0),
                    discount: e.discount,
                    orderDate: e.orderDate,
                    deliveryDate: e.deliveryDate,
                    paymentMethod: e.paymentMethod,
                    status: e.orderStatus,

                }
            )) || [],
        count: results.length
    };
}

async function createOrder(id, name, email, mobile, address, postCode, paymentMethod,) {
    let u;
    try {
        u = await userRepository.getUserById(id);
        if (!u)
            throw Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "User not found");
    }

    if (!u.cart || u.cart.length < 1)
        throw errorResponder(errors.NOT_FOUND, "User doesn't have a cart");
    await repository.transactionOrdering(u, name, email, mobile, address, postCode, paymentMethod,);
    return {
        message: "Successfully created an order!",
        status: 'pending'
    }

}

async function cancel(status, orderId, userId) {
    let order;
    try {
        order = await repository.getOrderByUserIdAndId(userId, orderId);
        if (!order)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Order not found");
    }

    if (['in delivery', 'delivered', 'completed', 'cancelled'].includes(order.status)) {
        throw errorResponder(errors.DB, "Status can't be cancelled");
    }

    const result = await repository.updateStatus(orderId, userId, status);
    if (result.modifiedCount < 1) {
        throw errorResponder(errors.DB, "Unable to update status");
    }

    return { message: "Successfully cancelled order status" };

}
async function completed(status, orderId, userId) {
    let order;
    try {
        order = await repository.getOrderByUserIdAndId(userId, orderId);
        if (!order)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Order not found");
    }

    if (['pending'].includes(order.status)) {
        throw errorResponder(errors.DB, "Status can't be completed");
    }

    const result = await repository.updateStatus(orderId, userId, status);
    if (result.modifiedCount < 1) {
        throw errorResponder(errors.DB, "Unable to update status");
    }

    return { message: "Successfully cancelled order status" };

}

async function updateStatus(status, orderId) {
    let order;
    try {
        order = await repository.getOrderById(orderId);
        if (!order)
            throw new Error();
    } catch (e) {
        throw errorResponder(errors.NOT_FOUND, "Order not found");
    }

    if (order.status === 'completed') {
        throw errorResponder(errors.DB, "Status can't be changed");
    }

    const result = await repository.updateStatusByOrder(status, orderId);
    if (result.modifiedCount < 1) {
        throw errorResponder(errors.DB, "Unable to update status");
    }

    return { message: "Successfully changed order status" };
}

module.exports = {
    hello,
    getHistory,
    createOrder,
    cancel,
    updateStatus,
    getAll,
    completed
}