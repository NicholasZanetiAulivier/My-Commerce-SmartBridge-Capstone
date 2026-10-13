const { ObjectId } = require("mongodb");

const name = __filename.slice(__dirname.length + 1, -3);

module.exports = (db) =>
    db.model(
        name,
        db.Schema(
            {
                createdAt: Date,
                token: String,
                userId: ObjectId
            },
            {
                collection: name,
            }
        )
    );
