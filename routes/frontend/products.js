const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

const Product = require('../../models/frontend/product');

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let fieldProduct = {
      name: req.body.name,
      type: req.body.type,
      amount: req.body.amount,
      numberofemployee: req.body.numberofemployee,
      amountperemployee: req.body.amountperemployee,
      additionfeatures: req.body.additionfeatures,
      status: req.body.status,
      companyid: req.user.companyid
  };

  if(req.body.productid) {
    Product.updateProduct(req.body.productid, fieldProduct, (err, product) => {
      if(err) {
        res.json({success: false, msg: 'Failed to update Product'});
      } else {
        res.json({success: true, msg: 'Product Updated'});
      }
    });
  } else {
    Product.addProduct(new Product(fieldProduct), (err, product) => {
      if(err){
        res.json({success: false, msg: 'Failed to add Product'});
      }else{
          res.json({success: true, msg: 'Product Add', data: product});
      }
    });
  }

});

router.get('/', (req, res, next) => {
  Product.find()
  .then(Product => {
    res.json({success: true, data: Product});
  })
  .catch(err => console.log(err));
});

router.delete('/:productid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Product.gerProductById(req.params.productid, (err, product) => {
    if (product) {
      if(product.companyid.toString() === req.user.companyid.toString()) {
        Product.deleteProduct(req.params.productid, (err, result) => {
          if(err){
            res.json({success: false, msg: 'Failed to delete Product'});
          }else{
            res.json({success: true, msg: 'Product deleted successfully'});
          }
        });
      } else {
        res.json({success: false, msg: 'Your not allowed to delete'});
      }
    } else {
      res.json({success: false, msg: 'Product not found'});
    }
  });
});

router.get('/:productid', (req, res, next) => {
  Product.gerProductById(req.params.productid, (err, product) => {
    if (product) {
      res.json({success: true, data: product});
    } else {
      res.json({success: false, msg: 'Product not found'});
    }
  });
});

router.get('/get/list', (req, res) => {
  Product.find({status: true})
  .then(product => {
    res.json({success: true, data: product});
  })
  .catch(err => console.log(err));
});

module.exports = router;
