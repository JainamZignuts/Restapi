const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product')
    .then(result => {
        res.status(200).json({
            count: result.length,
            orders: result.map(result => {
                return {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/orders/' + result._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
        message: 'Order Stored',
        createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
        },
        request: {
            type: 'GET',
            url: 'http://localhost:4000/orders/' + result._id
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
 }

 orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .then(result => {
         if(!result) {
             return res.status(404).json({
                 message: 'Order not found'
             });
         }
        res.status(200).json({
            order: result,
            request: {
                type: 'GET',
                url: 'http://localhost:4000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

orders_delete_order = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:4000/orders',
                body: { productId: 'ID', quantity: 'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

 module.exports = {
     orders_get_all,
     orders_create_order,
     orders_get_order,
     orders_delete_order
};