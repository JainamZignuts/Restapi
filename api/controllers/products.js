const mongoose = require('mongoose');
const Product = require('../models/product');

products_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .then(result => {
        const response ={
            count: result.length,
            products: result.map(result => {
                return {
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/products/' + result._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

products_create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });   
}

products_get_product = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .select('name price _id productImage')
    .then(result => {
        console.log(result);
        if (result) {
           res.json({
               product: result,
               request: {
                   type: 'GET',
                   url: 'http://localhost:4000/products'
               }
           }); 
        } else {
        res.json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({error: err});
    });
}

products_update_products = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { $set: updateOps})
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:4000/products/' +id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}

module.exports= {
    products_get_all,
    products_create_product,
    products_get_product,
    products_update_products
}