const fs = require("fs");

const { loadEnvFile } = require("node:process");
const path = require("node:path");
const envPath = ".env";

loadEnvFile(envPath);

process.env.NODE_ENV = (process.env.NODE_ENV || "development").toLowerCase();
module.exports = {
  name: "My-Commerce",
  env: process.env.NODE_ENV,
  api: {
    prefix: "/api",
    port: process.env.APP_PORT || 5000,
    name: process.env.APP_NAME || "API",
  },
  database: {
    connection: process.env.DB_CONNECTION,
    name: process.env.DB_NAME,
  },
  secret: {
    user: process.env.USER_SECRET
  }
};
