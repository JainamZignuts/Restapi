const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        // accept a file
        cb(null, true);
    } else {
        // reject a file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
       fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:id', ProductsController.products_get_product);

router.patch('/:id', checkAuth, ProductsController.products_update_products);

router.delete('/:id', checkAuth, (req, res, next) => {
    const id = req.params.id;
    Product.deleteOne({_id: id})
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:4000/products',
                body: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;