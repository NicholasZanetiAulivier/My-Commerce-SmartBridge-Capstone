const { ObjectId } = require("mongodb");

const name = __filename.slice(__dirname.length + 1, -3);

module.exports = (db) =>
    db.model(
        name,
        db.Schema({
            userId: String,
            name: String,
            email: String,
            mobile: String,
            address: String,
            pinCode: String,
            products: {
                type: [{
                    productId: ObjectId,
                    qty: Number,
                    size: String,
                    price: Number,
                    discount: Number
                }],
                min: 1,
                max: 50
            },
            discount: Number,
            paymentMethod: String,
            orderDate: Date,
            deliveryDate: Date,
            orderStatus: String
        },
            {
                collection: name,
            }
        )
    );
