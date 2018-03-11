var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET users listing. */
router.get('/1', function(req, res, next) {

  var url = 'https://www.turbosquid.com/Search/Index.cfm?file_type=119&keyword=apple&max_price=0&media_typeid=2&min_price=0';

  request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);

        $('#SearchResultAssets').filter(function(){
            var data = $(this);
            res.send(data.text());
        })
    }
  })
});

router.get('/2', function(req, res, next) {
  res.send('respond with second resource');
});

module.exports = router;
