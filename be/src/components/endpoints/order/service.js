const { errorResponder, errors } = require('../../../core/errors');
const repository = require('./repository');

async function hello() {
    const results = await repository.hello();
    return results;
}

async function getHistory(id, offset, limit) {
    let results;
    try {
        results = await repository.getOrderListByUid(id, offset, limit);
        console.log(results);
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
                        pincode: e.pinCode
                    },
                    products: e.products.map((p) => ({
                        productId: p.productId,
                        qty: p.qty,
                        size: p.size,
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

module.exports = {
    hello,
    getHistory
}