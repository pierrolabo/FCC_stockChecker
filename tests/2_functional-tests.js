/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('GET /api/stock-prices => stockData object', function () {
    test('1 stock', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end(function (err, res) {
          //complete this one too
          if (err) console.log(err);
          assert.equal(res.status, 200);
          done();
        });
    });

    test('1 stock with like', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'tt', likes: 'true' })
        .end(function (err, res) {
          //complete this one too
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'tt');
          assert.equal(res.body.stockData[0].likes, 1);
          assert.property(res.body.stockData[0], 'price');

          done();
        });
    });

    test('1 stock with like again (ensure likes arent double counted)', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'tt', likes: 'true' })
        .end(function (err, res) {
          //complete this one too
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'tt');
          assert.equal(res.body.stockData[0].likes, 1);
          assert.property(res.body.stockData[0], 'price');

          done();
        });
    });

    test('2 stocks', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['tt', 'fr'] })
        .end(function (err, res) {
          //complete this one too
          assert.equal(res.status, 200);
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'tt');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].stock, 'fr');
          assert.equal(res.body.stockData[1].rel_likes, 0);
          done();
        });
    });

    test('2 stocks with like', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['tt', 'fr'], likes: 'true' })
        .end(function (err, res) {
          //complete this one too
          assert.equal(res.status, 200);
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'tt');
          assert.equal(res.body.stockData[0].rel_likes, 0);
          assert.equal(res.body.stockData[1].stock, 'fr');
          assert.equal(res.body.stockData[1].rel_likes, 0);
          done();
        });
    });
  });
});
