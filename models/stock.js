const Mongoose = require('mongoose');
const getDb = require('../utils/database').getDb;
const Schema = Mongoose.Schema;
const axios = require('axios');

//{"stock":"GOOG","price":"786.90","likes":1}}
const stockSchema = new Schema({
  stock: { type: String },
  price: { type: Number },
  likes: { type: Number },
  ip: { type: Array },
});

const MongoStock = Mongoose.model('stock', stockSchema);

class Stock extends MongoStock {
  constructor(stock, price, like, ip) {
    super();
    this.stock = stock;
    this.price = price;
    this.likes = like;
    this.ip = ip;
  }

  static fetchAll(cb) {
    super.find({}, function (err, res) {
      if (err) console.log(err);
      cb(res);
    });
  }

  static async findStockByName(stock) {
    let doc = await super.find({ stock: stock }, function (err, res) {
      if (err) console.log(err);
    });
    return doc;
  }
  static async findIpAddress(ip, stock) {
    let query = { ip: ip, stock: stock };
    let doc = await super.find(query, function (err, res) {
      if (err) console.log(err);
    });

    return doc;
  }
  static async createStockOrUpdate(stock, price, likes, ip) {
    let query = { stock: stock };
    let update = {
      stock: stock,
      price: price,
      likes: likes,
      ip: ip,
    };
    let options = {
      upsert: true,
      setDefaultOnInsert: true,
      useFindAndModify: false,
    };
    let doc = await super.findOneAndUpdate(query, update, options, function (
      err
    ) {
      if (err) console.log(err);
    });
    return doc;
  }
  static async updateStockLikes(stock, like, ip) {
    let query = { stock: stock };
    let update = {
      stock: stock,
      likes: like,
      ip: ip,
    };
    let options = {
      upsert: true,
      setDefaultOnInsert: true,
      useFindAndModify: false,
    };
    let doc = await super.findOneAndUpdate(query, update, options, function (
      err
    ) {
      if (err) console.log(err);
    });
    return doc;
  }
  static async getStockPrice(stock) {
    const url = `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`;
    let res = await axios.get(url);
    return res.data.latestPrice;
  }
}

module.exports = Stock;
