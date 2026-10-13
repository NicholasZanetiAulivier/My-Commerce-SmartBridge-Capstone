const { ObjectId } = require("mongodb");

const name = __filename.slice(__dirname.length + 1, -3);

module.exports = (db) =>
    db.model(
        name,
        db.Schema(
            {
                username: String,
                password: String,
                email: String,
                type: String,
                cart: {
                    type: [{
                        productId: ObjectId,
                        qty: Number
                    }],
                    max: [50, 'Too many items in cart']
                }
            },
            {
                collection: name,
            }
        )
    );
