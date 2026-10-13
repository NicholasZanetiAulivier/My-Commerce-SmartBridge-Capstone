const jwt = require("jsonwebtoken");
const config = require("../core/config");
const { userPayload } = require("./jwt-payload");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const REFRESH_TOKEN_EXPIRY_SECONDS = 604_800;

// add jti
async function generateUserJwt(user) {
  return jwt.sign(userPayload(user), config.secret.user, {
    expiresIn: "15m",
    jwtid: uuidv4(),
  });
}

function verifyUserJwt(token) {
  return jwt.verify(token, config.secret.user);
}

// generate opaque string
async function generateRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  partitioned: true,
  path: "/",
  maxAge: REFRESH_TOKEN_EXPIRY_SECONDS * 1000,
};

module.exports = {
  generateUserJwt,
  generateRefreshToken,
  verifyUserJwt,
  REFRESH_TOKEN_EXPIRY_SECONDS,
  cookieOptions,
};
