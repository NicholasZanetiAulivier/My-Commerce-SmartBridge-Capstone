const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { stripUnknown: true });

const emailSchema = Joi.string().required().email().trim().messages({
    "any.required": "Email wajib ada!",
    "string.email": "Format email tidak valid!",
});

const usernameSchema = Joi.string().min(1).max(32).trim().messages({
    "any.required": "Username tidak boleh kosong!",
    "string.min": "Username tidak boleh kurang dari 1 karakter!",
    "string.empty": "Username tidak boleh kosong!",
    "string.max": "Panjang username tidak boleh lebih dari 32 karakter!",
});

const passwordSchema = Joi.string()
    .required()
    .min(12)
    .pattern(
        new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#@$!%*?&])[A-Za-z\\d#@$!%*?&]{3,30}$",
        ),
    )
    .messages({
        "any.required": "Password wajib ada!",
        "string.min": "Panjang password harus 12 karakter ke atas!",
        "string.pattern.base":
            "Password harus memiliki huruf besar, huruf kecil, dan karakter spesial (#@$!%*?&), dengan panjang 12-30 karakter!",
        "any.only": "Password dan confirm password tidak sesuai!",
    });


const registerSchema = Joi.object({
    username: usernameSchema.required(),
    email: emailSchema.required(),
    password: passwordSchema.required(),
    type: Joi.string().lowercase().valid('admin', 'user').required().messages({
        "any.required": "Type wajib ada!",
        "any.valid": "Type harus berupa 'admin' atau 'user'"
    })
});

// const time24hrSchema = Joi.string().pattern(
//   /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
// ); // HH:MM:SS 24 hr

const loginSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
});

const productSchema = Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().default(""),
    category: Joi.string().required(),
    price: Joi.number().min(0).required().default(0),
    discount: Joi.number()
});

const productUpdateSchema = Joi.object({
    title: Joi.string().min(5),
    description: Joi.string(),
    category: Joi.string(),
    price: Joi.number().min(0),
    discount: Joi.number()
});

const cartAddSchema = Joi.object({
    productId: Joi.string().required(),
    qty: Joi.number().integer().min(1).required()
})

const cartQuantitySchema = Joi.object({
    qty: Joi.number().integer().min(1).required()
});

const orderCreationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    address: Joi.string().required(),
    postCode: Joi.string().required(),
    paymentMethod: Joi.string().required(),
});

const orderStatusSchema = Joi.object({
    status: Joi.string().lowercase().valid('pending', 'canceled', 'in delivery', 'delivered', 'completed').required()
});

module.exports = {
    //  auth
    register: validator(registerSchema),
    login: validator(loginSchema),

    //Products
    product: validator(productSchema),
    productUpdate: validator(productUpdateSchema),


    //Cart
    cartAdd: validator(cartAddSchema),
    cartQuantity: validator(cartQuantitySchema),

    //Order
    orderCreation: validator(orderCreationSchema),
    orderStatus: validator(orderStatusSchema)
};
