const { errorResponder, errors } = require("../../core/errors");
const { verifyUserJwt } = require("../../utils/token");

module.exports.protect = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = verifyUserJwt(token);

        req.user = decoded;
        next();

      } catch (_error) {
        throw errorResponder(errors.UNAUTHORIZED, "Access token invalid");
      }
    }

    if (!token) {
      throw errorResponder(errors.UNAUTHORIZED, "Access token unavailable");
    }
  } catch (e) {
    next(e);
  }
};
