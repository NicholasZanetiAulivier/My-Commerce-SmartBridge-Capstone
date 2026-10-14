const { errorResponder, errors } = require('../core/errors');

function checkInteger(i, minVal, maxVal, defau) {
    if (i && Number.isInteger(i))
        throw errorResponder(errors.BAD_ID, "ID harus berupa angka bulat");
    return Math.max(Math.min(maxVal, i || defau), minVal)
}

module.exports = { checkInteger };