const express = require(`express`);
const controller = require('./controller');
const { protect } = require('../../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = file.originalname.split('.').pop();
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
        }
    })
});

const route = express.Router();

//Paths
route.get('/:id/image', controller.getProductImage);
route.get('/categories', controller.getCategories);
route.get('/:id', controller.getById);
route.get('/', controller.getProducts);

route.put('/:id', protect, upload.single('img'), controller.updateProduct);
route.post('/', protect, upload.single('img'), controller.createProduct);

route.delete('/:id', protect, controller.deleteProduct);

module.exports = route;