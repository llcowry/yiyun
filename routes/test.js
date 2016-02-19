var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var images = require('images');
var utils = require('../models/utils');
var dbutils = require('../models/mysql-utils');

module.exports = router;

// 采集场景页面模板
router.get('/collectPageTpl', function(req, res) {
  var data = [];
  var filedir = "uploadfiles/pagetpl-tmb/",
    filedir2 = "uploadfiles/pagetpl/";
  for (var i = 0; i < data.length; i++) {
    var tmbPath = filedir + utils.getFileName(data[i].properties.thumbSrc);
    request({
      method: 'GET',
      uri: 'http://s1.eqxiu.com/eqs/pageTpl/' + data[i].id,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
      }
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var body = JSON.parse(body),
          jsonObj = body.obj;

        var tmbSrc = jsonObj.properties.thumbSrc;
        var tmbPath = filedir + utils.getFileName(tmbSrc);
        request('http://res.eqxiu.com/' + tmbSrc).pipe(fs.createWriteStream('public/' + tmbPath));
        jsonObj.properties.thumbSrc = tmbPath;

        var el = jsonObj.elements,
          ct3Src, ct3Path, ct4Src, ct4Path, content;
        for (var j = 0; j < el.length; j++) {
          ct3Src = el[j].properties.imgSrc;
          if (ct3Src) {
            ct3Path = filedir2 + utils.getFileName(ct3Src);
            request('http://res.eqxiu.com/' + ct3Src).pipe(fs.createWriteStream('public/' + ct3Path));
            el[j].properties.imgSrc = ct3Path;
          }
          ct4Src = el[j].properties.src;
          if (ct4Src) {
            ct4Path = filedir2 + utils.getFileName(ct4Src);
            request('http://res.eqxiu.com/' + ct4Src).pipe(fs.createWriteStream('public/' + ct4Path));
            el[j].properties.src = ct4Path;
          }
        }
        content = JSON.stringify(el);
        content = content.replace(new RegExp('http://s1.eqxiu.com/eqs/link?id=1301&amp;url=http%3A%2F%2Feqxiu.com', 'gm'), '#gotourl#');
        content = content.replace(new RegExp('→<\/font><font\s{1}color=\\"#\w{6}\\">易企秀', 'gm'), '');

        dbutils.insert('xl_scene_pagetpl1', {
          "biztype": 1301,
          "name": jsonObj.name,
          "thumbsrc": jsonObj.properties.thumbSrc,
          "properties": null,
          "elements": content
        });
      }
    });
  }

  res.end('OK.');
});

router.get('/savefile--', function(req, res) {
  var data = [];
  // dbutils.execsql('delete from xl_uploadfile', null);
  var filedir = "uploadfiles/music/",
    filePath, tmbPath, data1 = [],
    data2 = [];
  for (var i = 0; i < 30; i++) {
    row = data[i];
    delete row.id;
    delete row.createTime;
    delete row.createUser;
    // tmbPath = filedir + utils.randomFileName(row.extName);
    // tmbPath = 'public/' + filedir + utils.getFileName(row.tmbPath);
    // request('http://res.eqxiu.com/' + row.tmbPath).pipe(fs.createWriteStream(tmbPath));
    // row.tmbPath = tmbPath;
    // data1[i] = 'http://res.eqxiu.com/' + row.tmbPath;
    // filePath = filedir + utils.randomFileName(row.extName);
    filePath = filedir + utils.getFileName(row.path);
    // request('http://res.eqxiu.com/' + row.path).pipe(fs.createWriteStream('public/' + filePath));
    row.path = filePath;
    // data2[i] = 'http://res.eqxiu.com/' + row.path;
    dbutils.insert('xl_sysfile', row);
  }
  // res.writeHead(200, {
  //   "Content-Type": "text/html"
  // });
  // res.end(data1.join("<br>")+"<br>"+data2.join("<br>"));
  res.end("OK.");
});

router.get('/saveinfo--', function(req, res) {
  var data = [];
  for (var i = 0; i < data.length; i++) {
    delete data[i].id;
    data[i].remark = "images/type/" + (parseInt(data[i].value) - 100) + ".png";
    dbutils.insert('xl_type', data[i]);
  }
  res.end(data.length + " - OK.");
});

router.get('/saveinfo2--', function(req, res) {
  // var urllist = [];
  // dbutils.getInfo('xl_scene_pagetpl', 'id>0', null, function(err, rows) {
  //   if (rows.length) {
  //     for (var i = 0; i < rows.length; i++) {
  //       urllist[i] = 'http://res.eqxiu.com/' + rows[i].thumbsrc;
  //     }
  //     res.end(urllist.join('\n'));
  //   }
  // });
  res.end('OK.');
});

router.get('/updateinfo--', function(req, res) {
  dbutils.getInfo('xl_scene_pagetpl', 'biztype=1301', null, function(err, rows) {
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var el = rows[i].elements;
        el = JSON.parse(el);
        // el = el.replace(/http\:\/\/s1\.eqxiu\.com\/eqs\/link\?id=1301&amp;url=http%3A%2F%2Feqxiu\.com/gm, '#gotourl#');
        // el = el.replace(/→<\/font><font\s{1}color=\\"#\w{6}\\">易企秀/gm, '');
        // rows[i].elements = el;
        var tmpData = [];
        for (var j = 0; j < el.length; j++) {
          if (el[j].type != 2) tmpData.push(el[j]);
        }
        rows[i].elements = JSON.stringify(tmpData);
        dbutils.update('xl_scene_pagetpl', rows[i]);
      }
    }
  });
  res.end('OK.');
});

router.get('/test--', function(req, res) {
  // images(images('public/uploadfiles/tp/2015-06/14dd1d8a561qfOPUB902.png'), 0, 6, 150, 75)
  //   .save('public/uploadfiles/tp/2015-06/1.png');
  res.end('OK.');
});