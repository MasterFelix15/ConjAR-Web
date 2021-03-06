var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var unrarp = require('unrar-promise');
var unzip = require('unzip');
var router = express.Router();

/* GET users listing. */
router.get('/search_for/:keyword', function(req, res, next) {
    parseTurboSquid(req.params.keyword, res);
});

module.exports = router;

var workingDir = process.cwd() + "/public/models/";

var options_srch = {
    method: 'GET',
    url: 'https://www.turbosquid.com/Search/Index.cfm',
    qs:
        { file_type: '119',
            keyword: 'keyword',
            max_price: '0',
            media_typeid: '2',
            min_price: '0',
            max_poly: '10k' },
    headers:
        { 'Postman-Token': '07c02164-7984-4a3c-b894-2c812067a03c',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
            'upgrade-insecure-requests': '1',
            cookie: 'cookie',
            'Cache-Control': 'no-cache',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }
};

var options_atc = {
    method: 'GET',
    url: 'https://www.turbosquid.com/AssetManager/Index.cfm',
    qs:
        { stgAction: 'getFiles',
            subAction: 'Download',
            intID: 'intID',
            intType: '3' },
    headers:
        { 'Postman-Token': '64ae8025-fff3-40f8-8784-8ca0200c6cb0',
            'Cache-Control': 'no-cache',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
            'upgrade-insecure-requests': '1',
            cookie: 'cookie',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }
};

var options_login = { method: 'POST',
    url: 'https://www.turbosquid.com/Login/Index.cfm',
    headers:
        {
            'Cache-Control': 'no-cache',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36',
            'upgrade-insecure-requests': '1',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        },
    formData:
        {
            LoginUsername: 'conjarweb@gmail.com',
            LoginPassword: 'ConjAR123',
            LoginRemember: '1',
            Action: 'Login',
            stgRU: 'https://www.turbosquid.com/',
            Clnt: '1',
            csrf: 'csrf'
        }
};

var options_dl = {
    method: 'GET',
    url: 'url',
    headers:
        { 'Postman-Token': '381d6bb3-0ffd-4d7e-93f5-be4ee7a75d7f',
            'Cache-Control': 'no-cache',
            cookie: 'cookie'
        }
};

function extractDownloadLink(assetid, body) {
    try {
        var jsonStr = body.split('var purchasedProductFileJSON = ')[1].split(';')[0];
        var ls = JSON.parse(jsonStr).FILE_SYSTEM;

        for(var i = 0; i < ls.length; i++) {
            var obj = ls[i];
            if (obj.FILEFORMAT.trim() == 'OBJ' && obj.PRODUCT_ID == assetid) {
                return {url: 'https://www.turbosquid.com/Download/' + obj.PRODUCT_ID + '_' + obj.FILEITEMID, name: obj.NAME};
            }
        }
    } catch (err) {
        console.log(body);
    }
}

function extractCookie(response) {
    var cookies = new Object();
    var cookie_lines = response.rawHeaders.filter(function (value) { return (value.split(';')[0].indexOf('='))!=-1 });
    cookie_lines.map(function (value) {
        var cookie = value.split(';')[0].split('=');
        cookies[cookie[0]] = cookie[1]; });
    var cookie_str = "";
    for (var key in cookies) {
        cookie_str+=key+'='+cookies[key]+';';
    }
    return cookie_str;
}

function extractall(fileName, next) {
    if (fileName.endsWith('.rar')) {
        console.log(fileName);
        unrarp.extractAll(workingDir+fileName, workingDir+fileName.split('.')[0]).then(function(exitCodes) {
            next();
        }, function(err) {
            console.log('Command failed to run with error: ', err);
        });
    } else if (fileName.endsWith('.zip')) {
        fs.createReadStream(workingDir+fileName).pipe(unzip.Extract({ path: workingDir+fileName.split('.zip')[0] })).on('finish', function (args) { next() });
    } else if (fileName.endsWith('.obj')) {

        var dir = fileName.split('.')[0];
        fs.mkdirSync(workingDir + dir);
        fs.rename(fileName, workingDir+fileName.split('.obj')[0]+'/'+fileName.split('.obj')[0]+'.obj' , function (err) {
            if (err) throw err;
        });
        next();
    }
}

function generateResponse(dirName) {
    var data = new Object();
    var files = fs.readdirSync(workingDir+dirName);
    for (var i = 0; i < files.length; i++) {
        if (files[i].toLowerCase().endsWith('.obj')) {
            data['obj'] = 'models/'+dirName+'/'+files[i];
        }
        if (files[i].toLowerCase().endsWith('.mtl')) {
            data['mtl'] = 'models/'+dirName+'/'+files[i];
        }
    }
    return data;
}

function parseTurboSquid(keyword, res) {
    options_srch.qs.keyword = keyword;
    request(options_login.url, function (error, response, body) {
        var $ = cheerio.load(body);
        var csrf = $('#csrf').attr('value');
        console.log("csrf code obtained: "+csrf);
        options_login.formData.csrf = csrf;
        request(options_login, function (error, response, body) {
            if (error) throw new Error(error);
            var cookie = extractCookie(response);
            console.log("cookie successfully refreshed: "+cookie);
            options_srch.headers.cookie = cookie;
            options_atc.headers.cookie = cookie;
            options_dl.headers.cookie = cookie;
            options_srch.qs.keyword = keyword;
            request(options_srch, function (error, response, body) {
                try {
                    if (error) throw new Error(error);
                    var $ = cheerio.load(body);
                    var assetid = $('#Asset1').parent().parent().attr('id').substr(5);
                    console.log("asset id located: "+assetid);
                    options_atc.qs.intID = assetid;
                    request(options_atc, function (error, response, body) {
                        try {
                            if (error) throw new Error(error);
                            var obj = extractDownloadLink(options_atc.qs.intID, body);
                            console.log("asset file download link: "+obj.url);
                            options_dl.url = obj.url;
                            var file = fs.createWriteStream(workingDir+obj.name);
                            var stream = request(options_dl).pipe(file);
                            stream.on('finish', function () {
                                try {
                                    console.log('file: '+obj.name+' has been downloaded');
                                    extractall(obj.name, function () {
                                        fs.unlinkSync(workingDir+obj.name);
                                        console.log('file: '+obj.name+' extracted, archive deleted');
                                        res.send(generateResponse(obj.name.split('.')[0]));
                                    });
                                } catch (e) {
                                    res.send({fail: "Server internal error (cannot extract file)."});
                                }
                            });
                        } catch (e) {
                            res.send({fail: "Error adding the item to cart."});
                        }
                    });
                } catch (e) {
                    res.send({fail: "Couldn't find the item you requested."});
                }
            });
        });
    });
}
