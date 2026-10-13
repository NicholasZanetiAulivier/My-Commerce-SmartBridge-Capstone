const { errorResponder, errors } = require('../core/errors');

function checkInteger(i, minVal, maxVal, defau) {
    if (i && Number.isInteger(i))
        throw errorResponder(errors.BAD_ID, "ID harus berupa angka bulat");
    return Math.max(Math.min(maxVal, i || defau), minVal)
}

function checkUserParamsTokenID(userId, paramUserId) {
    if (!(userId === paramUserId)) {
        throw errorResponder(errors.INVALID_CREDENTIALS, "User tidak memiliki hak akses untuk data yang diminta!");
    }
    return true;
}

module.exports = { checkInteger, checkUserParamsTokenID };