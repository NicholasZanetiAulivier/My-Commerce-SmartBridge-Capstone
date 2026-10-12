const name = __filename.slice(__dirname.length + 1, -3);

module.exports = (db) =>
    db.model(
        name,
        db.Schema(
            {
                username: String,
                password: String,
                email: String,
                type: String
            },
            {
                collection: name,
            }
        )
    );
