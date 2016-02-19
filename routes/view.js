var express = require('express');
var router = express.Router();
var fs = require('fs');
var utils = require('../models/utils');
var dbutils = require('../models/mysql-utils');
var syscfg = {};

module.exports = router;

// 获取场景详情
router.get('/:scenecode', function(req, res) {
  var scenecode = req.params.scenecode,
    where = 'code=?';
  if (!isNaN(scenecode)) where = 'id=?';
  dbutils.getInfo('xl_scene', where, scenecode, function(err, results) {
    if (results) {
      res.render('view', {
        title: results[0].name,
        keywords: results[0].name,
        description: results[0].description
      });
    } else {
      syscfg = utils.getSysCfg();
      res.render('view', {
        title: syscfg.webTitle,
        keywords: syscfg.webKey,
        description: syscfg.webDes
      });
    }
  });
});

// 收集页面展示数据
router.post('/pv', function(req, res) {
  var sceneid = req.query.id,
    statfrom = req.query.from || 'mobile';
  if (!utils.isMobile(req)) statfrom = '';
  dbutils.execsql('Update xl_scene Set showcount=showcount+1 Where id=?', req.query.id, function(err, results) {
    if (results) {
      dbutils.insert('xl_pv_data', {
        "sceneid": sceneid,
        "statfrom": statfrom,
        "userip": utils.getIp(req),
        "statdate": utils.formatTimestamp()
      }, function(err, result) {
        if (result.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": null,
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 记录拨号信息
router.post('/dial', function(req, res) {
  dbutils.count('xl_scene', 'id=?', req.body.id, function(err, c) {
    if (c) {
      dbutils.insert('xl_dial_data', {
        "sceneid": req.body.id,
        "num": req.body.num,
        "userip": utils.getIp(req),
        "dialtime": utils.formatTimestamp()
      }, function(err, result) {
        if (result.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": null,
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 收集场景数据
router.post('/save', function(req, res) {
  var data = {};
  for (var item in req.body) {
    var s = item.replace('eq[', '').replace(']', '');
    eval('data.' + s + ' = req.body[item];');
  }
  dbutils.execsql('Update xl_scene Set datacount=datacount+1 Where id=?', req.query.id, function(err, results) {
    if (results) {
      var curRow = results[0];
      dbutils.insert('xl_customer_data', {
        "sceneid": req.query.id,
        "scenename": curRow.name,
        "createuser": curRow.createuser,
        "data": JSON.stringify(data),
        "submittime": utils.formatTimestamp(new Date().getTime())
      }, function(err, result) {
        if (result.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": null,
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 举报场景
router.post('/expose', function(req, res) {
  dbutils.getInfo('xl_expose', 'sceneid=? And ip=?', [req.body.sceneId, req.ip], function(err, results) {
    if (results == '') {
      dbutils.insert('xl_expose', {
        "sceneid": req.body.sceneId,
        "type": req.body.type,
        "ip": req.ip,
        "exposetime": utils.formatDT(),
      }, function(err, result) {
        if (result.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": null,
            "map": null,
            "list": null
          });
        }
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 1001,
        "msg": "您已举报过此场景！",
        "obj": null,
        "map": null,
        "list": null
      });
    }
  });
});