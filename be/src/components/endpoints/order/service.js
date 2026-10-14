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
                    status: e.orderStatus
                }
            )),
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

module.exports = {
    hello,
    getHistory,
    createOrder
}