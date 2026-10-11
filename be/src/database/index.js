const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = require('../core/config');
const logger = require('../core/logger')('app');

// Join the database connection string
const connectionString = new URL(config.database.connection);
connectionString.pathname += config.database.name;

mongoose.connect(`${connectionString.toString()}`);

const db = mongoose.connection;
db.once('open', () => {
    logger.info('Successfully connected to MongoDB');
});

const dbExports = {};
dbExports.db = db;

const modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath)
    .filter(
        (file) =>
            file.indexOf('.') !== 0 &&
            file.slice(-3) === '.js'
    )
    .forEach((file) => {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const model = require(path.join(modelsPath, file))(mongoose);
        dbExports[model.modelName] = model;
    });

module.exports = dbExports;
