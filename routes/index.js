var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var request = require('request');
var utils = require('../models/utils');
var mailutils = require('../models/mail-utils');
var dbutils = require('../models/mysql-utils');
var syscfg = {};

module.exports = router;

// 默认加载首页
router.get('/', function(req, res, next) {
  syscfg = utils.getSysCfg();
  if (!syscfg.webStatus) res.end(syscfg.webCloseReason);
  res.render('index', {
    title: syscfg.webTitle,
    keywords: syscfg.webKey,
    description: syscfg.webDes
  });
});

// 链接跳转
router.get('/link', function(req, res) {
  var act = req.query.act;
  switch (act) {
    case "recharge":
    case "upgrade":
      res.render('404');
      break;
    case "ie6update":
      res.render('ie6update');
      break;
    default:
      res.redirect(req.query.url);
      break;
  }
});

// 用户登录验证
router.post('/login', function(req, res) {
  var userName = req.body.username;
  dbutils.getInfo('xl_user', 'loginname=?', userName, function(err, results) {
    if (results == '') {
      return res.jsonp({
        "success": false,
        "code": 1003,
        "msg": "用户名不存在",
        "obj": null,
        "map": {
          "isValidateCodeLogin": false
        },
        "list": null
      });
    }
    var userPwd = crypto.createHash('md5').update(req.body.password).digest('hex');
    if (results[0].loginname != userName || results[0].loginpwd != userPwd) {
      return res.jsonp({
        "success": false,
        "code": 1004,
        "msg": "用户名或密码错误",
        "obj": null,
        "map": {
          "isValidateCodeLogin": false
        },
        "list": null
      });
    } else {
      var rememberMe = req.body.rememberMe;
      if (rememberMe) {
        res.cookie('rememberMe', {
          "uid": results[0].id,
          "username": results[0].loginname,
          "nickname": results[0].username
        }, {
          maxAge: 86400000
        });
      }
      utils.setSession(req, res, {
        "id": results[0].id,
        "name": results[0].loginname,
        "nickname": results[0].username
      });
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "登录成功",
        "obj": null,
        "map": null,
        "list": null
      });
    }
  });
});

// 用户注册验证
router.post('/register', function(req, res) {
  var userName = req.body.email;
  dbutils.getInfo('xl_user', 'loginname=?', userName, function(err, results) {
    if (results.length) {
      return res.jsonp({
        "success": false,
        "code": 1003,
        "msg": "已存在此用户",
        "obj": null,
        "map": null,
        "list": null
      });
    } else {
      var userPwd = crypto.createHash('md5').update(req.body.password).digest('hex');
      dbutils.insert('xl_user', {
        "loginname": userName,
        "loginpwd": userPwd,
        "name": userName.split('@')[0],
        "email": userName,
        "sex": 1,
        "regtime": utils.formatTimestamp(new Date().getTime()),
        "status": 1,
        "type": 1
      }, function(err, results) {
        if (results.length) {
          utils.setSession(req, res, {
            "id": results[0].id,
            "name": results[0].loginname,
            "nickname": results[0].username
          });
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": {
              "id": results[0].id,
              "loginName": results[0].loginname,
              "xd": results[0].xd,
              "sex": results[0].sex,
              "phone": results[0].phone,
              "tel": results[0].tel,
              "qq": results[0].qq,
              "headImg": results[0].headimg,
              "idNum": results[0].idnum,
              "idPhoto": results[0].idphoto,
              "regTime": results[0].regtime ? new Date(results[0].regtime).getTime() : null,
              "extType": results[0].exttype,
              "property": !results[0].property ? "{}" : results[0].property,
              "companyId": results[0].companyid,
              "deptName": results[0].deptname,
              "deptId": results[0].deptid,
              "name": results[0].name,
              "email": results[0].email,
              "type": results[0].type,
              "status": results[0].status,
              "relType": results[0].reltype,
              "companyTplId": results[0].companytplid,
              "roleIdList": !results[0].roleidlist ? [] : results[0].roleidlist.split(",")
            },
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 重置密码
router.post('/resetPwd', function(req, res) {
  var key = req.body.key,
    newPwd = req.body.newPwd;
  if (!newPwd) {
    return res.jsonp({
      "success": false,
      "code": 1001,
      "msg": "新密码不能为空"
    });
  }
  var loginname = new Buffer(key.substr(3), 'base64').toString();
  dbutils.getInfo('xl_user', 'loginname=?', loginname, function(err, rows) {
    if (rows.length) {
      newPwd = crypto.createHash('md5').update(newPwd).digest('hex');
      dbutils.update('xl_user', {
        "loginpwd": newPwd,
        "id": rows[0].id
      }, function(err, results) {
        if (results.length) {
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

// 找回密码
router.post('/retrievePwd', function(req, res) {
  var syscfg = utils.getSysCfg(),
    loginname = req.body.email,
    resetToken = null,
    curUrl = syscfg.webUrl;
  if (!loginname) {
    return res.jsonp({
      "success": false,
      "code": 1001,
      "msg": "账号不能为空"
    });
  }
  dbutils.getInfo('xl_user', 'loginname=?', loginname, function(err, results) {
    if (results == '') {
      return res.jsonp({
        "success": false,
        "code": 1003,
        "msg": "账号不存在",
        "obj": null,
        "map": null,
        "list": null
      });
    } else {
      resetToken = new Buffer(loginname).toString('base64');
      resetToken = utils.randomStr(3) + resetToken;
      mailutils.send({
        from: 'YiYun.XL <' + syscfg.sysMail.user + '>',
        to: loginname,
        subject: '找回密码',
        html: '<p>您好！' + results[0].name + '：<br />你申请的找回密码成功，请点击下面的链接，根据页面提示完成密码重置：<br />' + curUrl + '/#/home/reset?resetToken=' + resetToken + '</p><p>如果链接无法点击，请完整拷贝到浏览器地址栏里直接访问。</p><p>（这是一封自动发送的邮件，请不要直接回复）</p><p style="text-align:right">YiYun.XL<br />' + utils.formatDT() + '</p>'
      }, function(err, result) {
        if (!err) {
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

// 用户安全退出
router.get('/logout', function(req, res) {
  res.cookie('rememberMe', '', {
    maxAge: 0
  });
  req.session.destroy(function() {
    res.redirect('/');
  });
});

// 第三方帐号绑定
router.post('/relAccount', function(req, res) {
  syscfg = utils.getSysCfg();
  var appId = syscfg.qqAppId,
    openId = req.body.openId,
    accessToken = req.body.accessToken,
    type = req.body.type,
    expires = req.body.expires,
    url = null,
    relUser = req.query.relUser || 0,
    loginName = req.query.loginName,
    loginPwd = req.query.loginPassword;
  if (relUser) {
    dbutils.getInfo('xl_user', 'loginname=?', loginName, function(err, results) {
      if (results == '') {
        loginPwd = crypto.createHash('md5').update(loginPwd).digest('hex');
        dbutils.update('xl_user', {
          "loginname": loginName,
          "loginpwd": loginPwd,
          "email": loginName,
          "id": relUser
        }, function(err, results2) {
          if (results2) {
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
          "code": 1003,
          "msg": "已存在此用户",
          "obj": null,
          "map": null,
          "list": null
        });
      }
    });
  } else {
    switch (type) {
      case "qq":
        url = 'https://graph.qq.com/user/get_user_info?oauth_consumer_key=' + appId + '&access_token=' + accessToken + '&openid=' + openId + '&format=json';
        break;
    }
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var nickName, headImg, sex;
        switch (type) {
          case "qq":
            nickName = data.nickname;
            headImg = data.figureurl_qq_2;
            sex = data.gender == '男' ? 1 : 2;
            break;
        }
        dbutils.getInfo('xl_oauth', 'type=? And openid=?', [type, openId], function(err, rows) {
          if (rows.length) {
            dbutils.getInfo('xl_user', 'id=?', rows[0].userid, function(err, results) {
              if (results) {
                utils.setSession(req, res, {
                  "id": results[0].id,
                  "name": results[0].loginname,
                  "nickname": results[0].username
                });
                return res.jsonp({
                  "success": true,
                  "code": 200,
                  "msg": "操作成功",
                  "obj": data,
                  "map": null,
                  "list": null
                });
              }
            });
          } else {
            if (!req.session.user) {
              var userName = 'yy_' + utils.randomStr16(),
                userPwd = '',
                relType = [type];
              dbutils.insert('xl_user', {
                "loginname": userName,
                "loginpwd": userPwd,
                "email": '',
                "name": nickName,
                "headimg": headImg,
                "sex": sex,
                "regtime": utils.formatTimestamp(new Date().getTime()),
                "status": 1,
                "type": 1,
                "reltype": JSON.stringify(relType)
              }, function(err, results) {
                if (results) {
                  utils.setSession(req, res, {
                    "id": results[0].id,
                    "name": results[0].loginname,
                    "nickname": results[0].username
                  });
                  dbutils.insert('xl_oauth', {
                    "userid": results[0].id,
                    "type": type,
                    "key": openId
                  }, function(err, results2) {
                    if (results2) {
                      return res.jsonp({
                        "success": true,
                        "code": 200,
                        "msg": "操作成功",
                        "obj": data,
                        "map": null,
                        "list": null
                      });
                    }
                  });
                }
              });
            } else {
              var userid = req.session.user.id;
              dbutils.getInfo('xl_user', 'id=?', userid, function(err, results) {
                if (results) {
                  var relType = results[0].reltype || '[]';
                  relType = JSON.parse(relType);
                  relType.push(type);
                  dbutils.update('xl_user', {
                    "reltype": JSON.stringify(relType),
                    "id": userid
                  }, function(err, results2) {
                    if (results2) {
                      dbutils.insert('xl_oauth', {
                        "userid": userid,
                        "type": type,
                        "openid": openId
                      }, function(err, results3) {
                        if (results3) {
                          return res.jsonp({
                            "success": true,
                            "code": 200,
                            "msg": "操作成功",
                            "obj": data,
                            "map": null,
                            "list": null
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  }
});

// 绑定微信账号
router.post('/relWechatAccount', function(req, res) {
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": null,
    "list": null
  });
});

// 获取场景类型
router.get('/getSceneType', function(req, res) {
  dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'scene_type', function(err, results) {
    if (results.length) {
      var data = [];
      for (var i = 0; i < results.length; i++) {
        data[i] = {
          "id": results[i].id,
          "name": results[i].name,
          "value": results[i].value,
          "type": results[i].type,
          "sort": results[i].sort,
          "status": results[i].status,
          "remark": results[i].remark
        };
      }
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": null,
        "map": null,
        "list": data
      });
    }
  });
});

// 获取场景推荐案例
router.get('/getSceneSamples', function(req, res) {
  var where = "ispromotion=1",
    vals = [];
  if (req.query.type) where += " And type=?", vals[vals.length] = req.query.type;
  dbutils.getPageInfo('xl_scene', where, vals, {
    "pageNo": req.query.pageNo,
    "pageSize": req.query.pageSize
  }, function(err, results) {
    var data = [],
      rows = results.data;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var curRow = rows[i];
        data[i] = {
          "id": curRow.id,
          "name": curRow.name,
          "code": curRow.code,
          "type": curRow.type,
          "pageMode": curRow.pagemode,
          "description": curRow.description,
          "sourceId": curRow.sourceid,
          "image": {
            "imgSrc": curRow.imgsrc,
            "hideEqAd": curRow.hideeqad ? !0 : !1,
            "isAdvancedUser": curRow.isadvanceduser ? !0 : !1,
            "lastPageId": curRow.lastpageid
          },
          "sort": curRow.sort,
          "dataCount": curRow.datacount,
          "showCount": curRow.showcount,
          "createTime": curRow.createtime ? utils.formatDT(curRow.createtime) : null,
          "createUser": curRow.createuser,
          "userLoginName": null,
          "userName": curRow.username,
          "avatar": null,
          "tags": null
        };
        if (curRow.bgaudio) data[i].image.bgAudio = JSON.parse(curRow.bgaudio);
      }
    }
    return res.jsonp({
      "success": true,
      "code": 200,
      "msg": "操作成功",
      "obj": null,
      "map": {
        "count": results.count,
        "pageNo": parseInt(results.pageNo),
        "pageSize": parseInt(results.pageSize)
      },
      "list": data
    });
  });
});

// 获取场景预览详情
router.get('/getScenePreview', function(req, res) {
  var getData = function(sceneid) {
    dbutils.getInfo('xl_scene_page', "sceneid=? And createuser='0' Order By num", sceneid, function(err, results) {
      if (results.length) {
        var data = [];
        for (var i = 0; i < results.length; i++) {
          data[i] = {
            "id": results[i].id,
            "sceneId": results[i].sceneid,
            "num": results[i].num,
            "name": results[i].name,
            "properties": !results[i].properties ? null : JSON.parse(results[i].properties),
            "elements": !results[i].elements ? [] : JSON.parse(results[i].elements),
            "scene": null
          };
        }
        dbutils.getInfo('xl_scene', 'id=?', sceneid, function(err, rows) {
          if (rows.length) {
            var scene = {
              "id": rows[0].id,
              "name": rows[0].name,
              "type": rows[0].type,
              "pageMode": rows[0].pagemode,
              "description": rows[0].description,
              "image": {
                "imgSrc": rows[0].imgsrc
              },
              "isTpl": rows[0].istpl,
              "isPromotion": rows[0].ispromotion,
              "status": rows[0].status,
              "openLimit": rows[0].openlimit,
              "startDate": rows[0].startdate ? new Date(rows[0].startdate).getTime() : null,
              "endDate": rows[0].enddate ? new Date(rows[0].enddate).getTime() : null,
              "createTime": rows[0].createtime ? new Date(rows[0].createtime).getTime() : null,
              "updateTime": rows[0].updatetime ? new Date(rows[0].updatetime).getTime() : null,
              "publishTime": rows[0].publishtime ? new Date(rows[0].publishtime).getTime() : null,
              "applyTemplate": rows[0].applytemplate,
              "applyPromotion": rows[0].applypromotion,
              "sourceId": rows[0].sourceid,
              "code": rows[0].code,
              "sort": rows[0].sort,
              "bgAudio": rows[0].bgaudio,
              "cover": rows[0].cover || rows[0].imgsrc,
              "property": !rows[0].property ? null : rows[0].property,
              "bizType": rows[0].biztype,
              "propMap": rows[0].propmap,
              "pageCount": rows[0].pagecount,
              "dataCount": rows[0].datacount,
              "showCount": rows[0].showcount,
              "createUser": rows[0].createuser,
              "userLoginName": rows[0].userloginname,
              "userName": rows[0].username
            };
            if (!scene.property) {
              scene.property = JSON.stringify({
                "eqAdType": rows[0].isadvanceduser,
                "hideEqAd": rows[0].hideeqad ? !0 : !1,
                "lastPageId": rows[0].lastpageid
              });
            }
            return res.jsonp({
              "success": true,
              "code": 200,
              "msg": "操作成功",
              "obj": scene,
              "map": null,
              "list": data
            });
          }
        });
      }
    });
  };
  if (req.query.code) {
    dbutils.getInfo('xl_scene', 'code=?', req.query.code, function(err, rows) {
      if (rows.length) getData(rows[0].id);
      else {
        return res.jsonp({
          "success": false,
          "code": 1001,
          "msg": "参数错误",
          "obj": null,
          "map": null,
          "list": null
        });
      }
    });
  } else {
    getData(req.query.id);
  }
});

// 获取页面模板
router.get('/getPageTpl', function(req, res) {
  dbutils.getInfo('xl_scene_pagetpl', "id=?", req.query.id, function(err, rows) {
    if (rows.length) {
      var data = {
        "id": rows[0].id,
        "name": rows[0].name,
        "num": 0,
        "properties": rows[0].properties,
        "elements": !rows[0].elements ? [] : JSON.parse(rows[0].elements),
        "sceneId": null,
        "scene": null
      };
      if (rows[0].thumbsrc) {
        data.properties = {
          "thumbSrc": rows[0].thumbsrc
        };
      }
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": data,
        "map": null,
        "list": null
      });
    }
  });
});

// 微信接入验证
router.get('/wxCheck', function(req, res) {
  var syscfg = utils.getSysCfg(),
    token = syscfg.wxToKen,
    signature = req.query.signature,
    timestamp = req.query.timestamp,
    nonce = req.query.nonce,
    echostr = req.query.echostr,
    tmpArr = [token, timestamp, nonce];
  tmpArr.sort();
  var tmpStr = tmpArr.join(''),
    shasum = crypto.createHash('sha1');
  shasum.update(tmpStr);
  var shaRes = shasum.digest('hex');
  if (shaRes == signature) {
    res.send(echostr);
  } else {
    res.send('Not Weixin Server!');
  }
});

// 获取微信的jsapi_config
router.get('/wxGetJsConfig', function(req, res) {
  var syscfg = utils.getSysCfg(),
    WechatAPI = require('wechat-api'),
    api = new WechatAPI(syscfg.wxAppId, syscfg.wxAppSecret);
  api.getJsConfig({
    debug: !parseInt(req.query.debug) ? false : true,
    url: req.query.url,
    jsApiList: !req.query.apilist ? [] : req.query.apilist.split(',')
  }, function(err, result) {
    return res.jsonp(result);
  });
});

// =========== 以下部分暂无具体业务逻辑 ===========

// 校验找回密码token
router.get('/validateToken', function(req, res) {
  // req.query.token
  // 暂无具体业务逻辑
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": null,
    "list": null
  });
});

// 获取场景样例的PV数据
router.get('/getSceneSamplesPV', function(req, res) {
  // 暂无具体逻辑
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": {
      "dayTop": 0,
      "monthTop": 0,
      "weekTop": 0
    },
    "map": null,
    "list": null
  });
});

// 绑定微信账号
router.post('/relWechatAccount', function(req, res) {
  // 暂无具体逻辑
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": null,
    "list": null
  });
});