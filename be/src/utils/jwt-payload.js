const config = require('../core/config')

const userPayload = user => ({
    id: user._id,
    username: user.username,
    type: user.type,
    email: user.email,
})

module.exports = {
    userPayload,
}