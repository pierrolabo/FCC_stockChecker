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
    let answer = [];
    let like = req.query.likes || req.query.like;
    let ip = req.ip;

    if (Array.isArray(req.query.stock)) {
      //two stocks query
      for await (const stock of req.query.stock) {
        let doc = await processRequest(stock, like, ip);
        answer.push(doc);
      }
      answer[0].rel_likes = answer[0].likes - answer[1].likes;
      answer[1].rel_likes = answer[1].likes - answer[0].likes;
      delete answer[0].likes;
      delete answer[1].likes;
    } else {
      //Single stock query
      let doc = await processRequest(req.query.stock, like, ip);
      answer.push(doc);
    }
    res.status(200).json({ stockData: answer });
  });
  async function processRequest(stock, reqLikes, reqIp) {
    let reqStocks = stock;
    let ip = reqIp;
    let ipFounds = await Stock.findIpAddress(ip, reqStocks);
    let like = ipFounds.length > 0 ? false : reqLikes;

    try {
      let stockStored = await Stock.findStockByName(reqStocks);
      if (stockStored.length > 0) {
        //Stock already exist in our database

        //like is defined
        //update the like counts
        if (like) {
          let newLike = stockStored[0].likes + 1;
          let newIps = [...stockStored[0].ip, ip];
          let doc = await Stock.updateStockLikes(reqStocks, newLike, newIps);
          return { stock: doc.stock, price: doc.price, likes: doc.likes };
        }
        return {
          stock: stockStored[0].stock,
          price: stockStored[0].price,
          likes: stockStored[0].likes,
        };
      } else {
        //Stock doesnt exist in our database

        let price = await Stock.getStockPrice(reqStocks);
        //if like is not set, set to 0
        let newLike = like ? 1 : 0;
        let newIp = like ? ip : '';
        let doc = await Stock.createStockOrUpdate(
          reqStocks,
          price,
          newLike,
          newIp
        );
        return { stock: doc.stock, price: doc.price, likes: doc.likes };
      }
    } catch (error) {
      console.log('error in stock processing..');
      console.log(error);
    }
  }
};
