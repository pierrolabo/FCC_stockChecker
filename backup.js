/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
const Stock = require('../models/stock');
module.exports = function (app) {
  app.route('/api/stock-prices').get(async (req, res) => {
    let reqStocks = req.query.stock;
    let like = req.query.likes;

    if (Array.isArray(reqStocks)) {
      //two stocks query
      reqStocks.forEach((reqStock) => {});
    } else {
      //Single stock query
      try {
        let stockStored = await Stock.findStockByName(reqStocks);
        if (stockStored.length > 0) {
          //Stock already exist in our database

          //like is defined
          //update the like counts
          if (like) {
            let newLike = stockStored[0].likes + 1;
            let doc = await Stock.updateStockLikes(reqStocks, newLike);
          }

          res.status(200).json('ok');
        } else {
          //Stock doesnt exist in our database
          let price = await Stock.getStockPrice(reqStocks);
          //if like is not set, set to 0
          let newLike = like ? 1 : 0;
          let doc = await Stock.createStockOrUpdate(
            reqStocks,
            price,
            newLike,
            req.ip
          );
          res.status(200);
        }
      } catch (error) {
        console.log('error in single stock processing..');
        console.log(error);
      }
    }
    async function processRequest(req, res) {}
  });
};
