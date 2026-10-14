const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function hashPassword(plaintextPassword) {
  const saltRounds = 12;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

async function passwordMatched(plaintextPassword, hashedPassword) {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
}

async function hashOpaqueString(string) {
  const result = crypto.createHash('sha512').update(string).digest('hex');
  return result;
}

async function compareOpaqueStringHash(string, hashedString) {
  const hashed = await hashOpaqueString(string);

  return (hashed === hashedString) ? true : false;
}

module.exports = {
  hashPassword,
  passwordMatched,
  hashOpaqueString,
  compareOpaqueStringHash
};