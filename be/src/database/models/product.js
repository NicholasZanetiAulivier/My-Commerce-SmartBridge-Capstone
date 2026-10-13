const name = __filename.slice(__dirname.length + 1, -3);

module.exports = (db) =>
    db.model(
        name,
        db.Schema(
            {
                title: String,
                description: String,
                mainImg: String,
                carousel: Array,
                sizes: Array,
                category: String,
                gender: String,
                price: Number,
                discount: Number,
            },
            {
                collection: name,
            }
        )
    );
