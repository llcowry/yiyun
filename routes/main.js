var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var async = require('async');
var moment = require('moment');
var utils = require('../models/utils');
var dbutils = require('../models/mysql-utils');
var syscfg = {};

module.exports = router;

// 获取用户信息
router.get(['/reqCurrentUser', '/getUserInfo'], function(req, res) {
  dbutils.getInfo('xl_user', 'id=?', req.session.user.id, function(err, results) {
    if (results.length) {
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
    } else {
      return res.jsonp({
        "success": false,
        "code": 1003,
        "msg": "不存在此用户",
        "obj": null,
        "map": null,
        "list": null
      });
    }
  });
});

// 更新用户信息
router.post('/saveUserInfo', function(req, res) {
  dbutils.update('xl_user', {
    "name": req.body.name,
    "sex": req.body.sex,
    "phone": req.body.phone,
    "tel": req.body.tel,
    "qq": req.body.qq,
    "headimg": req.body.headImg,
    "id": req.body.id
  }, function(err, results) {
    if (results.length) {
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
});

// 修改登录密码
router.post('/changePwd', function(req, res) {
  var oldPwd = req.body.oldPwd,
    newPwd = req.body.newPwd;
  if (!oldPwd) {
    return res.jsonp({
      "success": false,
      "code": 1001,
      "msg": "旧密码不能为空"
    });
  }
  if (!newPwd) {
    return res.jsonp({
      "success": false,
      "code": 1001,
      "msg": "新密码不能为空"
    });
  }
  dbutils.getInfo('xl_user', 'id=?', req.session.user.id, function(err, rows) {
    if (rows.length) {
      var md5 = crypto.createHash('md5');
      oldPwd = md5.update(oldPwd).digest('hex');
      if (rows[0].loginpwd != oldPwd) {
        return res.jsonp({
          "success": false,
          "code": 1004,
          "msg": "旧密码不正确",
          "obj": null,
          "map": null,
          "list": null
        });
      } else {
        md5 = crypto.createHash('md5');
        newPwd = md5.update(newPwd).digest('hex');
        dbutils.update('xl_user', {
          "loginpwd": newPwd,
          "id": req.session.user.id
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
    }
  });
});

// 取消第三方帐号绑定
router.post('/unRelation', function(req, res) {
  var type = req.body.type,
    userid = req.session.user.id;
  dbutils.getInfo('xl_user', 'id=?', userid, function(err, results) {
    if (results) {
      var relType = results[0].reltype || '[]';
      relType = JSON.parse(relType);
      relType.splice(type, 1);
      dbutils.update('xl_user', {
        "reltype": JSON.stringify(relType),
        "id": userid
      }, function(err, results2) {
        if (results2) {
          dbutils.delInfo('xl_oauth', 'userid=?', userid, function(err, results3) {
            if (results3) {
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
    }
  });
});

// 获取场景模板集
router.get('/getSceneTpls', function(req, res) {
  var where = "istpl=1",
    vals = [];
  if (req.query.bizType) where += " And type=?", vals[vals.length] = req.query.bizType;
  if (req.query.tagId) where += " And biztype=?", vals[vals.length] = req.query.tagId;
  switch (req.query.orderBy) {
    case "new":
      where += " Order By createtime";
      break;
    case "hot":
      where += " Order By showcount Desc, datacount Desc";
      break;
    default:
      where += " Order By sort";
      break;
  }
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
          "cover": curRow.cover,
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

// 获取用户场景
router.get(['/getMyScenes', '/getMyScenes/:typeid'], function(req, res) {
  var where = "createuser=?",
    vals = [req.session.user.id],
    typeid = req.params.typeid || 0;
  if (parseInt(typeid) > 0) where = "createuser=? And type=?", vals[1] = req.params.typeid;
  dbutils.getPageInfo('xl_scene', where, vals, {
    "pageNo": req.query.pageNo,
    "pageSize": req.query.pageSize
  }, function(err, results) {
    var data = [];
    if (results.data.length) {
      for (var i = 0; i < results.data.length; i++) {
        var curRow = results.data[i];
        data[i] = {
          "id": curRow.id,
          "name": curRow.name,
          "type": curRow.type,
          "pageMode": curRow.pagemode,
          "description": curRow.description,
          "image": {
            "bgAudio": !curRow.bgaudio ? null : JSON.parse(curRow.bgaudio),
            "imgSrc": curRow.imgsrc,
            "hideEqAd": curRow.hideeqad ? !0 : !1,
            "isAdvancedUser": curRow.isadvanceduser ? !0 : !1,
            "lastPageId": curRow.lastpageid
          },
          "isTpl": curRow.istpl,
          "isPromotion": curRow.ispromotion,
          "status": curRow.status,
          "openLimit": curRow.openlimit,
          "startDate": curRow.startdate ? new Date(curRow.startdate).getTime() : null,
          "endDate": curRow.enddate ? new Date(curRow.enddate).getTime() : null,
          "createTime": curRow.createtime ? new Date(curRow.createtime).getTime() : null,
          "updateTime": curRow.updatetime ? new Date(curRow.updatetime).getTime() : null,
          "publishTime": curRow.publishtime ? new Date(curRow.publishtime).getTime() : null,
          "applyTemplate": curRow.applytemplate,
          "applyPromotion": curRow.applypromotion,
          "sourceId": curRow.sourceid,
          "code": curRow.code,
          "sort": curRow.sort,
          "cover": curRow.cover,
          "property": !curRow.property ? "{}" : curRow.property,
          "bizType": curRow.biztype,
          "propMap": curRow.propmap,
          "pageCount": curRow.pagecount,
          "dataCount": curRow.datacount,
          "showCount": curRow.showcount,
          "createUser": curRow.createuser,
          "userLoginName": curRow.userloginname,
          "userName": curRow.username
        };
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

// 获取场景详情
router.get('/getSceneDetail', function(req, res) {
  dbutils.getInfo('xl_scene', 'id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": {
          "id": rows[0].id,
          "name": rows[0].name,
          "type": rows[0].type,
          "pageMode": rows[0].pagemode,
          "description": rows[0].description,
          "image": {
            "bgAudio": !rows[0].bgaudio ? null : JSON.parse(rows[0].bgaudio),
            "imgSrc": rows[0].imgsrc,
            "hideEqAd": rows[0].hideeqad ? !0 : !1,
            "isAdvancedUser": rows[0].isadvanceduser ? !0 : !1,
            "lastPageId": rows[0].lastpageid
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
          "cover": rows[0].cover,
          "property": !rows[0].property ? "{}" : rows[0].property,
          "bizType": rows[0].biztype,
          "propMap": rows[0].propmap,
          "pageCount": rows[0].pagecount,
          "dataCount": rows[0].datacount,
          "showCount": rows[0].showcount,
          "createUser": rows[0].createuser,
          "userLoginName": rows[0].userloginname,
          "userName": rows[0].username
        },
        "map": null,
        "list": null
      });
    }
  });
});

// 创建空白场景
router.post('/createBlankScene', function(req, res) {
  dbutils.insert('xl_scene', {
    "name": req.body.name,
    "type": req.body.type,
    "pagemode": req.body.pageMode,
    "imgsrc": "images/defaultscene.png",
    "createtime": utils.formatTimestamp(new Date().getTime()),
    "code": utils.randomStr16(),
    "userloginname": req.session.user.name,
    "createuser": req.session.user.id
  }, function(err, rows) {
    if (rows.length) {
      dbutils.insert('xl_scene_page', {
        "sceneid": rows[0].id,
        "name": "第1页",
        "num": 1,
        "elements": null
      }, function(err, rows) {
        if (rows.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": rows[0].sceneid,
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 创建模板场景
router.post('/createTplScene', function(req, res) {
  dbutils.getInfo('xl_scene', "id=?", req.body.id, function(err, rows) {
    if (rows.length) {
      dbutils.insert('xl_scene', {
        "name": req.body.name,
        "type": req.body.type,
        "pagemode": req.body.pageMode,
        "imgsrc": rows[0].imgsrc,
        "biztype": rows[0].biztype,
        "createtime": utils.formatTimestamp(new Date().getTime()),
        "code": utils.randomStr16(),
        "userloginname": req.session.user.name,
        "createuser": req.session.user.id
      }, function(err, result) {
        if (result.length) {
          var sceneid = result[0].id,
            j = 0;
          dbutils.getInfo('xl_scene_page', "sceneid=? And createuser='0'", req.body.id, function(err, rows) {
            if (rows.length) {
              for (var i = 0; i < rows.length; i++) {
                dbutils.insert('xl_scene_page', {
                  "sceneid": sceneid,
                  "name": rows[i].name,
                  "num": i + 1,
                  "elements": rows[i].elements
                }, function(err, result) {
                  if (result.length) {
                    j++;
                    if (j == rows.length) {
                      return res.jsonp({
                        "success": true,
                        "code": 200,
                        "msg": "操作成功",
                        "obj": sceneid,
                        "map": null,
                        "list": null
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});

// 复制场景
router.get('/copySceneById/:sceneid', function(req, res) {
  dbutils.getInfo('xl_scene', "id=?", req.params.sceneid, function(err, rows) {
    if (rows.length) {
      dbutils.insert('xl_scene', {
        "name": rows[0].name + "-副本",
        "type": rows[0].type,
        "description": rows[0].description,
        "pagemode": rows[0].pagemode,
        "imgsrc": rows[0].imgsrc,
        "biztype": rows[0].biztype,
        "createtime": utils.formatTimestamp(new Date().getTime()),
        "code": utils.randomStr16(),
        "userloginname": rows[0].userloginname,
        "createuser": rows[0].createuser
      }, function(err, result) {
        if (result.length) {
          var sceneid = result[0].id,
            j = 0;
          dbutils.getInfo('xl_scene_page', "sceneid=? And createuser='0'", req.params.sceneid, function(err, rows) {
            if (rows.length) {
              for (var i = 0; i < rows.length; i++) {
                dbutils.insert('xl_scene_page', {
                  "sceneid": sceneid,
                  "name": rows[i].name,
                  "num": i + 1,
                  "elements": rows[i].elements
                }, function(err, result) {
                  if (result.length) {
                    j++;
                    if (j == rows.length) {
                      return res.jsonp({
                        "success": true,
                        "code": 200,
                        "msg": "操作成功",
                        "obj": sceneid,
                        "map": null,
                        "list": null
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});

// 转送场景
router.post('/transferScene', function(req, res) {
  dbutils.getInfo('xl_user', 'loginname=?', req.query.loginName, function(err, rows) {
    if (rows == '') {
      return res.jsonp({
        "success": false,
        "code": 1003,
        "msg": "不存在此用户"
      });
    } else {
      dbutils.update('xl_scene', {
        "userloginname": req.query.loginName,
        "createuser": rows[0].id,
        "id": req.query.id
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

// 发布场景
router.get('/publishScene/:sceneid', function(req, res) {
  dbutils.update('xl_scene', {
    "status": 1,
    "publishtime": utils.formatTimestamp((new Date).getTime()),
    "id": req.params.sceneid
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
});

// 开放场景
router.get('/openScene/:sceneid', function(req, res) {
  dbutils.update('xl_scene', {
    "status": 1,
    "id": req.params.sceneid
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
});

// 关闭场景
router.get('/closeScene/:sceneid', function(req, res) {
  dbutils.update('xl_scene', {
    "status": 2,
    "id": req.params.sceneid
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
});

// 删除场景
router.get('/deleteSceneById/:sceneid', function(req, res) {
  dbutils.delInfo('xl_scene', "id=?", req.params.sceneid, function(err, results) {
    if (results.affectedRows) {
      dbutils.delInfo('xl_scene_page', "sceneid=? And createuser='0'", req.params.sceneid, function(err, results) {
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

// 保存场景信息
router.post('/saveSceneSettings', function(req, res) {
  var hideAd = req.body.image.hideEqAd;
  dbutils.update('xl_scene', {
    "name": req.body.name,
    "type": req.body.type,
    "pagemode": req.body.pageMode,
    "description": req.body.description,
    "applytemplate": req.body.applyTemplate,
    "applypromotion": req.body.applyPromotion,
    "imgsrc": req.body.image.imgSrc,
    "hideeqad": hideAd,
    "lastpageid": req.body.image.lastPageId,
    "updatetime": utils.formatTimestamp(req.body.updateTime),
    "id": req.body.id
  }, function(err, results) {
    if (results) {
      if (hideAd) {
        async.waterfall([
          function(cb) {
            dbutils.insert('xl_gold_log', {
              "biztype": "pay",
              "biztitle": "使用",
              "remark": "场景[" + req.body.code + "]去尾页使用金币",
              "xd": 100,
              "username": req.session.user.name,
              "opttime": utils.formatDT()
            }, function(err, results) {
              if (results.length) cb(null, 1);
              else cb(null, 0);
            });
          },
          function(b, cb) {
            dbutils.execsql('update xl_user set xd=xd-100 where id=?', req.session.user.id, function(err, results) {
              if (results.affectedRows && b) cb(null, 1);
              else cb(null, 0);
            });
          }
        ], function(err, b) {
          if (b) {
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
          "success": true,
          "code": 200,
          "msg": "操作成功",
          "obj": null,
          "map": null,
          "list": null
        });
      }
    }
  });
});

// 获取场景页面集
router.get('/getScenePageList', function(req, res) {
  dbutils.getInfo('xl_scene_page', "sceneid=? And createuser='0' Order By num", req.query.id, function(err, results) {
    if (results.length) {
      var data = [];
      for (var i = 0; i < results.length; i++) {
        data[i] = {
          "id": results[i].id,
          "sceneId": results[i].sceneid,
          "num": results[i].num,
          "name": results[i].name,
          "properties": results[i].properties,
          "elements": !results[i].elements ? [] : JSON.parse(results[i].elements),
          "scene": null
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

// 获取场景页面对象集
router.get('/getSceneByPage', function(req, res) {
  dbutils.getInfo('xl_scene_page', 'id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      var scenePage = rows[0];
      dbutils.getInfo('xl_scene', 'id=?', scenePage.sceneid, function(err, rows) {
        if (rows.length) {
          var scene = {
            "id": rows[0].id,
            "name": rows[0].name,
            "type": rows[0].type,
            "pageMode": rows[0].pagemode,
            "description": rows[0].description,
            "image": {
              "bgAudio": !rows[0].bgaudio ? null : JSON.parse(rows[0].bgaudio),
              "imgSrc": rows[0].imgsrc,
              "hideEqAd": rows[0].hideeqad ? !0 : !1,
              "isAdvancedUser": rows[0].isadvanceduser ? !0 : !1,
              "lastPageId": rows[0].lastpageid
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
            "cover": rows[0].cover,
            "property": !rows[0].property ? "{}" : rows[0].property,
            "bizType": rows[0].biztype,
            "propMap": rows[0].propmap,
            "pageCount": rows[0].pagecount,
            "dataCount": rows[0].datacount,
            "showCount": rows[0].showcount,
            "createUser": rows[0].createuser,
            "userLoginName": rows[0].userloginname,
            "userName": rows[0].username
          };
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": {
              "id": scenePage.id,
              "sceneId": scenePage.sceneid,
              "num": scenePage.num,
              "name": scenePage.name,
              "properties": !scenePage.properties ? null : JSON.parse(scenePage.properties),
              "elements": !scenePage.elements ? [] : JSON.parse(scenePage.elements),
              "scene": scene
            },
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 创建&复制场景页面
router.get('/createScenePage', function(req, res) {
  dbutils.getInfo('xl_scene_page', 'id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      var scenePage = rows[0];
      dbutils.getInfo('xl_scene', 'id=?', scenePage.sceneid, function(err, rows) {
        if (rows.length) {
          var scene = {
            "id": rows[0].id,
            "name": rows[0].name,
            "type": rows[0].type,
            "pageMode": rows[0].pagemode,
            "description": rows[0].description,
            "image": {
              "bgAudio": !rows[0].bgaudio ? null : JSON.parse(rows[0].bgaudio),
              "imgSrc": rows[0].imgsrc,
              "hideEqAd": rows[0].hideeqad ? !0 : !1,
              "isAdvancedUser": rows[0].isadvanceduser ? !0 : !1,
              "lastPageId": rows[0].lastpageid
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
            "cover": rows[0].cover,
            "property": !rows[0].property ? "{}" : rows[0].property,
            "bizType": rows[0].biztype,
            "propMap": rows[0].propmap,
            "pageCount": rows[0].pagecount,
            "dataCount": rows[0].datacount,
            "showCount": rows[0].showcount,
            "createUser": rows[0].createuser,
            "userLoginName": rows[0].userloginname,
            "userName": rows[0].username
          };
          dbutils.insert('xl_scene_page', {
            "sceneid": scenePage.sceneid,
            "num": scenePage.num + 1,
            "properties": !req.query.copy ? null : scenePage.properties,
            "elements": !req.query.copy ? null : scenePage.elements
          }, function(err, rows) {
            if (rows.length) {
              return res.jsonp({
                "success": true,
                "code": 200,
                "msg": "操作成功",
                "obj": {
                  "id": rows[0].id,
                  "sceneId": rows[0].sceneid,
                  "num": rows[0].num,
                  "name": rows[0].name,
                  "properties": !rows[0].properties ? null : JSON.parse(rows[0].properties),
                  "elements": !rows[0].elements ? [] : JSON.parse(rows[0].elements),
                  "scene": scene
                },
                "map": null,
                "list": null
              });
            }
          });
        }
      });
    }
  });
});

// 保存场景页面信息
router.post('/saveScenePage', function(req, res) {
  var sceneid = req.body.sceneId;
  dbutils.getInfo('xl_scene_page', 'sceneid=?', sceneid, function(err, rows) {
    var data = [];
    if (rows.length) {
      for (var k = 0; k < rows.length; k++) {
        var elements = rows[k].elements;
        if (elements) {
          elements = JSON.parse(elements);
          for (var i = 0, j = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el.isInput || el.type == 5) {
              data[j] = {
                "id": el.id,
                "title": el.title
              }, j++;
            }
          }
        }
      }
    }
    for (var i = 0, j = data.length; i < req.body.elements.length; i++) {
      var el = req.body.elements[i];
      if (el.isInput || el.type == 5 || el.type == 501 || el.type == 502 || el.type == 503) {
        data[j] = {
          "id": el.id,
          "title": el.title
        }, j++;
      }
    }
    dbutils.update('xl_scene', {
      "formfield": JSON.stringify(data),
      "id": req.body.sceneId
    }, function(err, results) {
      if (results.length) {
        dbutils.update('xl_scene_page', {
          "name": req.body.name,
          "properties": JSON.stringify(req.body.properties),
          "elements": JSON.stringify(req.body.elements),
          "id": req.body.id
        }, function(err, results) {
          var bgaudio = req.body.scene.image.bgAudio;
          dbutils.update('xl_scene', {
            "bgaudio": !bgaudio ? null : JSON.stringify(bgaudio),
            "id": req.body.sceneId
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
        });
      }
    });
  });
});

// 保存场景页面名称
router.post('/saveScenePageName', function(req, res) {
  dbutils.update('xl_scene_page', {
    "name": req.body.name,
    "id": req.body.id
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
});

// 删除场景页面
router.get('/delScenePage', function(req, res) {
  dbutils.delInfo('xl_scene_page', 'id=?', req.query.id, function(err, results) {
    if (results.affectedRows) {
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
});

// 保存我的场景页面模板
router.post('/saveMyPageTpl', function(req, res) {
  var sceneid = req.body.sceneId || req.body.scene.id;
  dbutils.insert('xl_scene_page', {
    "sceneid": sceneid,
    "num": 0,
    "name": null,
    "properties": JSON.stringify(req.body.properties),
    "elements": JSON.stringify(req.body.elements),
    "createuser": req.session.user.id
  }, function(err, rows) {
    if (rows.length) {
      dbutils.update('xl_user', {
        "property": JSON.stringify({
          "myTplId": sceneid
        }),
        "id": req.session.user.id
      }, function(err, results) {
        if (results.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": sceneid,
            "map": null,
            "list": null
          });
        }
      });
    }
  });
});

// 获取我的场景页面模板集
router.get('/getMyPageTpls', function(req, res) {
  // 创建的模板在当前场景可用
  // dbutils.getInfo('xl_scene_page', 'createuser=? And sceneid=?', [req.session.user.id, req.query.id], function(err, rows) {
  dbutils.getInfo('xl_scene_page', 'createuser=?', req.session.user.id, function(err, rows) {
    var data = [];
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "sceneId": rows[i].sceneid,
          "name": rows[i].name,
          "num": rows[i].num,
          "properties": !rows[i].properties ? null : JSON.parse(rows[i].properties),
          "elements": !rows[i].elements ? [] : JSON.parse(rows[i].elements),
          "scene": null
        };
      }
    }
    return res.jsonp({
      "success": true,
      "code": 200,
      "msg": "操作成功",
      "obj": null,
      "map": null,
      "list": data
    });
  });
});

// 改变场面页面排序值
router.post('/changePageSort', function(req, res) {
  var sortData = req.body.pos.split(","),
    j = 0;
  for (var i = 0; i < sortData.length; i++) {
    dbutils.update('xl_scene_page', {
      "num": i + 1,
      "id": sortData[i]
    }, function(err, rows) {
      if (rows.length) {
        j++;
        if (j == sortData.length) {
          return res.jsonp({
            "success": true,
            "code": 200,
            "msg": "操作成功",
            "obj": null,
            "map": null,
            "list": null
          });
        }
      };
    });
  }
});

// 获取页面模板分类
router.get('/getPageTplTypes', function(req, res) {
  dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'tpl_page', function(err, rows) {
    if (rows.length) {
      var data = [];
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "name": rows[i].name,
          "value": rows[i].value,
          "type": rows[i].type,
          "sort": rows[i].sort,
          "status": rows[i].status,
          "remark": rows[i].remark
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

// 获取页面模板子分类
router.get('/getPageTagLabel', function(req, res) {
  var where = 'type=?',
    vals = [req.query.type];
  if (req.query.bizType) where += ' And biztype=?', vals[1] = req.query.bizType;
  dbutils.getInfo('xl_scene_tag', where, vals, function(err, rows) {
    if (rows.length) {
      var data = [];
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "name": rows[i].name,
          "bizType": rows[i].biztype,
          "type": rows[i].type
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

// 获取页面模板所属的分类集
router.get('/getPageTagLabelCheck', function(req, res) {
  dbutils.getInfo('xl_scene_pagetpl', 'id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      dbutils.getInfo('xl_scene_pagetpl', 'name=? And thumbsrc=?', [rows[0].name, rows[0].thumbsrc], function(err, rows2) {
        if (rows2.length) {
          var tid = [];
          for (var i = 0; i < rows2.length; i++) {
            tid[i] = rows2[i].typeid;
          }
          dbutils.getInfo('xl_scene_tag', 'id In (' + tid.join(",") + ')', null, function(err, rows3) {
            if (rows3.length) {
              var data = [];
              for (var i = 0; i < rows3.length; i++) {
                var curRow = rows3[i];
                data[i] = {
                  "id": curRow.id,
                  "name": curRow.name,
                  "bizType": curRow.biztype,
                  "type": curRow.type,
                  "lang": null
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
        }
      });
    }
  });
});

// 获取页面模板集
router.get('/getPageTpls', function(req, res) {
  var where = 'status=1',
    vals = [];
  if (req.query.bizType) where += " And biztype=?", vals[vals.length] = req.query.bizType;
  if (req.query.tagId) where += " And typeid=?", vals[vals.length] = req.query.tagId;
  where += ' Order By sort';
  dbutils.getInfo('xl_scene_pagetpl', where, vals, function(err, rows) {
    var data = [];
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var curRow = rows[i];
        data[i] = {
          "id": curRow.id,
          "name": curRow.name,
          "num": 0,
          "properties": curRow.properties,
          "elements": null,
          "sceneId": null,
          "scene": null
        };
        if (curRow.thumbsrc) {
          data[i].properties = {
            "thumbSrc": curRow.thumbsrc
          };
        }
      }
    }
    return res.jsonp({
      "success": true,
      "code": 200,
      "msg": "操作成功",
      "obj": null,
      "map": null,
      "list": data
    });
  });
});

// 记录页面模板的使用次数
router.post('/recordTplUsage', function(req, res) {
  dbutils.execsql('Update xl_scene_pagetpl Set usecount=usecount+1 Where id=?', req.query.id, function(err, results) {
    if (results.affectedRows) {
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
});

// 获取我所有场景的展示数据
router.get('/getAllPageView', function(req, res) {
  dbutils.sum('xl_scene', 'showcount', 'createuser=?', req.session.user.id, function(err, result) {
    if (!err) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": result,
        "map": null,
        "list": null
      });
    }
  });
});

// 获取我所有场景的收集数据
router.get('/getAllSceneDataCount', function(req, res) {
  dbutils.sum('xl_scene', 'datacount', 'createuser=?', req.session.user.id, function(err, result) {
    if (!err) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": result,
        "map": null,
        "list": null
      });
    }
  });
});

// 获取我所有开放的场景
router.get('/getOpenSceneCount', function(req, res) {
  dbutils.count('xl_scene', 'createuser=? And status=1', req.session.user.id, function(err, result) {
    if (!err) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": result,
        "map": null,
        "list": null
      });
    }
  });
});

// 获取场景可导入的客户数据
router.get('/getProspectDataAccount', function(req, res) {
  dbutils.execsql('Select Count(1) As count From xl_customer_data Where createuser=?', req.session.user.id, function(err, result) {
    if (result.length) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": result[0].count,
        "map": null,
        "list": null
      });
    }
  });
});

// 获取场景所有的客户数
router.get('/getAllDataCount', function(req, res) {
  dbutils.count('xl_customer', 'createuser=?', req.session.user.id, function(err, result) {
    if (!err) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": result,
        "map": null,
        "list": null
      });
    }
  });
});

// 获取所有可导入数据的场景信息
router.get('/getPremergeScenes', function(req, res) {
  dbutils.execsql('Select sceneid As ID,scenename As TITLE From xl_customer_data Where createuser=? Group By sceneid', req.session.user.id, function(err, rows) {
    var data = [];
    if (rows.length) {
      data = rows;
    }
    return res.jsonp({
      "success": true,
      "code": 200,
      "msg": "操作成功",
      "obj": null,
      "map": null,
      "list": data
    });
  });
});

// 获取场景表单字段
router.get('/getSceneField', function(req, res) {
  dbutils.execsql('Select formfield From xl_scene Where id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": null,
        "map": null,
        "list": !rows[0].formfield ? [] : JSON.parse(rows[0].formfield)
      });
    }
  });
});

// 导入客户数据
router.post('/mergeSceneData', function(req, res) {
  dbutils.getInfo('xl_customer_data', 'sceneid=?', req.query.id, function(err, rows) {
    if (rows.length) {
      var data = JSON.parse(rows[0].data),
        id = rows[0].id;
      data['f_undefined'] = null;
      dbutils.insert('xl_customer', {
        "name": data['f_' + req.body.name],
        "sex": data['f_' + req.body.sex],
        "mobile": data['f_' + req.body.mobile],
        "tel": data['f_' + req.body.tel],
        "email": data['f_' + req.body.email],
        "company": data['f_' + req.body.company],
        "job": data['f_' + req.body.job],
        "address": data['f_' + req.body.address],
        "website": data['f_' + req.body.website],
        "qq": data['f_' + req.body.qq],
        "weixin": data['f_' + req.body.weixin],
        "yixin": data['f_' + req.body.yixin],
        "weibo": data['f_' + req.body.weibo],
        "laiwang": data['f_' + req.body.laiwang],
        "remark": data['f_' + req.body.remark],
        "origin": rows[0].sceneid,
        "originname": rows[0].scenename,
        "status": 1,
        "createuser": rows[0].createuser,
        "createtime": utils.formatTimestamp(new Date().getTime()),
      }, function(err, result) {
        if (result.length) {
          dbutils.delInfo('xl_customer_data', 'id=?', id, function(err, results) {
            if (results.affectedRows) {
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
    }
  });
});

// 获取未导入的场景数据 
router.get('/getDataBySceneId', function(req, res) {
  dbutils.getInfo('xl_scene', 'id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      var ftdata = [],
        formfield = rows[0].formfield;
      formfield = formfield ? JSON.parse(formfield) : [];
      ftdata[0] = "ID";
      for (var k = 0; k < formfield.length; k++) {
        ftdata[k + 1] = formfield[k].title;
      }
      ftdata[formfield.length + 1] = "提交时间";
      dbutils.getPageInfo('xl_customer_data', 'sceneid=?', req.query.id, {
        "pageNo": req.query.pageNo,
        "pageSize": req.query.pageSize
      }, function(err, results) {
        var data = [],
          rows = results.data;
        if (rows.length) {
          data.push(ftdata);
          for (var i = 0; i < rows.length; i++) {
            var frdata = [],
              fvdata = {};
            frdata.push(rows[i].id);
            fvdata = JSON.parse(rows[i].data);
            for (var j in fvdata) frdata.push(fvdata[j]);
            frdata.push(utils.formatDT(rows[i].submittime));
            data.push(frdata);
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
    }
  });
});

// 获取所有的客户数据
router.get('/getAllData', function(req, res) {
  dbutils.getPageInfo('xl_customer', 'createuser=?', req.session.user.id, {
    "pageNo": req.query.pageNo,
    "pageSize": req.query.pageSize
  }, function(err, results) {
    var data = [],
      rows = results.data;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "name": rows[i].name,
          "sex": rows[i].sex,
          "mobile": rows[i].mobile,
          "tel": rows[i].tel,
          "email": rows[i].email,
          "company": rows[i].company,
          "job": rows[i].job,
          "address": rows[i].address,
          "website": rows[i].website,
          "qq": rows[i].qq,
          "weixin": rows[i].weixin,
          "yixin": rows[i].yixin,
          "weibo": rows[i].weibo,
          "laiwang": rows[i].laiwang,
          "remark": rows[i].remark,
          "origin": rows[i].origin,
          "originName": rows[i].originname,
          "status": rows[i].status,
          "createUser": rows[i].createuser,
          "createTime": rows[i].createtime ? new Date(rows[i].createtime).getTime() : null,
          "groupId": rows[i].groupid,
          "groupName": rows[i].groupname,
          "group": null
        };
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

// 获取客户数据详情
router.get('/getDataDetail', function(req, res) {
  dbutils.getInfo('xl_customer', 'id=?', req.query.id, function(err, rows) {
    var data = {};
    if (rows.length) {
      data = {
        "id": rows[0].id,
        "name": rows[0].name,
        "sex": rows[0].sex,
        "mobile": rows[0].mobile,
        "tel": rows[0].tel,
        "email": rows[0].email,
        "company": rows[0].company,
        "job": rows[0].job,
        "address": rows[0].address,
        "website": rows[0].website,
        "qq": rows[0].qq,
        "weixin": rows[0].weixin,
        "yixin": rows[0].yixin,
        "weibo": rows[0].weibo,
        "laiwang": rows[0].laiwang,
        "remark": rows[0].remark,
        "origin": rows[0].origin,
        "originName": rows[0].originname,
        "status": rows[0].status,
        "createUser": rows[0].createuser,
        "createTime": rows[0].createtime ? new Date(rows[0].createtime).getTime() : null,
        "groupId": rows[0].groupid,
        "groupName": rows[0].groupname,
        "group": !rows[0].groupdata || rows[0].groupdata == "[]" ? [] : JSON.parse(rows[0].groupdata)
      };
      // 取消查询分组数据
      // var where = !data.groupId ? ' Order By sort Limit 1' : ' Where id In (' + data.groupId + ') Order By sort';
      // dbutils.execsql('Select id,name From xl_customer_group' + where, null, function(err, rows) {
      //   if (rows.length) {
      //     data.group = rows;
      //     return res.jsonp({
      //       "success": true,
      //       "code": 200,
      //       "msg": "操作成功",
      //       "obj": data,
      //       "map": null,
      //       "list": null
      //     });
      //   }
      // });
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

// 删除客户数据
router.get('/deleteDataById', function(req, res) {
  dbutils.delInfo('xl_customer', "id=?", req.query.id, function(err, results) {
    if (results.affectedRows) {
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
});

// 删除客户数据（多选）
router.post('/deleteCustomer', function(req, res) {
  dbutils.delInfo('xl_customer', 'id In (' + req.query.ids + ')', null, function(err, results) {
    if (results.affectedRows) {
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
});

// 保存客户数据
router.post('/saveData', function(req, res) {
  dbutils.update('xl_customer', {
    "name": req.body.name,
    "sex": req.body.sex,
    "mobile": req.body.mobile,
    "tel": req.body.tel,
    "email": req.body.email,
    "company": req.body.company,
    "job": req.body.job,
    "address": req.body.address,
    "website": req.body.website,
    "qq": req.body.qq,
    "weixin": req.body.weixin,
    "yixin": req.body.yixin,
    "weibo": req.body.weibo,
    "laiwang": req.body.laiwang,
    "remark": req.body.remark,
    "status": req.body.status,
    "id": req.body.id
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
});

// 获取客户分组
router.get('/getGroups', function(req, res) {
  dbutils.execsql('Select id,name From xl_customer_group Order By sort Asc', null, function(err, rows) {
    var data = [{
      "id": -1,
      "name": "未分组"
    }];
    if (rows.length) {
      data = data.concat(rows);
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

// 添加客户分组
router.post('/setGroup', function(req, res) {
  dbutils.getInfo('xl_customer_group', 'id In (' + req.query.gIds + ') Order By sort', null, function(err, rows) {
    if (rows.length) {
      var gNames = [];
      for (var i = 0; i < rows.length; i++) {
        gNames[i] = rows[i].name;
        delete rows[i].sort;
      }
      dbutils.update('xl_customer', {
        "groupid": req.query.gIds,
        "groupname": gNames.join(","),
        "groupdata": JSON.stringify(rows),
        "id": req.query.cIds
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

// 解除客户分组
router.post('/unsetGroup', function(req, res) {
  dbutils.execsql('Select groupdata From xl_customer Where id=?', parseInt(req.query.cId), function(err, rows) {
    if (rows.length) {
      var data = !rows[0].groupdata ? [] : JSON.parse(rows[0].groupdata);
      for (var i = 0; i < data.length; i++) {
        if (parseInt(data[i].id) === parseInt(req.query.gId)) data.splice(i, 1);
      }
      var gIds = [],
        gNames = [];
      for (var i = 0; i < data.length; i++) {
        gIds[i] = data[i].id;
        gNames[i] = data[i].name;
      }
      dbutils.update('xl_customer', {
        "groupid": gIds.join(","),
        "groupname": gNames.join(","),
        "groupdata": JSON.stringify(data),
        "id": req.query.cId
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

// 创建分组
router.post('/createGroup', function(req, res) {
  dbutils.insert('xl_customer_group', {
    "name": req.body.name
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
});

// 删除分组
router.post('/deleteGroup', function(req, res) {
  dbutils.delInfo('xl_customer_group', 'id=?', req.query.id, function(err, results) {
    if (results.affectedRows) {
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
});

// 导出客户数据
router.get('/exportCustomer', function(req, res) {
  dbutils.getInfo('xl_customer', 'createuser=?', req.session.user.id, function(err, rows) {
    var data = [];
    data[0] = '姓名,性别,手机,邮箱,公司,职务,固定电话,地址,网址,QQ号,微信号,易信号,微博号,来往号,客户群组,客户来源,其它';
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        data[i + 1] = rows[i].name + ',' +
          rows[i].sex + ',' +
          rows[i].mobile + ',' +
          rows[i].email + ',' +
          rows[i].company + ',' +
          rows[i].job + ',' +
          rows[i].tel + ',' +
          rows[i].address + ',' +
          rows[i].website + ',' +
          rows[i].qq + ',' +
          rows[i].weixin + ',' +
          rows[i].yixin + ',' +
          rows[i].weibo + ',' +
          rows[i].laiwang + ',' +
          rows[i].groupname + ',' +
          rows[i].originname + ',' +
          rows[i].remark;
      }
    }
    res.set({
      'Content-Type': 'text/csv',
      'Content-disposition': 'attachment; filename=' + encodeURIComponent('我的客户数据.csv'),
      'Pragma': 'no-cache',
      'Expires': 0
    });
    res.send(new Buffer('\xEF\xBB\xBF', 'binary') + new Buffer(data.join('\r\n')));
  });
});

// 导出场景数据
router.get('/exportSceneData', function(req, res) {
  dbutils.getInfo('xl_scene', 'id=?', req.query.id, function(err, rows) {
    if (rows.length) {
      var data = [],
        ftdata = [],
        formfield = JSON.parse(rows[0].formfield);
      for (var i = 0; i < formfield.length; i++) {
        ftdata[i] = formfield[i].title;
      }
      ftdata[formfield.length] = "提交时间";
      dbutils.getInfo('xl_customer_data', 'sceneid=?', req.query.id, function(err, rows) {
        if (rows.length) {
          data[0] = ftdata.join(',');
          var k = 1,
            frdata = [];
          for (i = 0; i < rows.length; i++) {
            var j = 0,
              fvdata = JSON.parse(rows[i].data);
            for (var item in fvdata) {
              frdata[j] = fvdata[item];
              j++;
            }
            frdata[j] = utils.formatDT(rows[i].submittime);
            data[k] = frdata.join(',');
            k++;
          }
          res.set({
            'Content-Type': 'text/csv',
            'Content-disposition': 'attachment; filename=' + encodeURIComponent('我的场景数据.csv'),
            'Pragma': 'no-cache',
            'Expires': 0
          });
          res.send(new Buffer('\xEF\xBB\xBF', 'binary') + new Buffer(data.join('\r\n')));
        }
      });
    }
  });
});

// 获取场景统计数据
router.get('/getStatData', function(req, res) {
  var showC = 0,
    dataC = 0,
    telC = 0,
    linkC = 0,
    wxTimelineC = 0,
    wxGrorpC = 0,
    wxSingleC = 0,
    mobileC = 0,
    data = [],
    startDate = moment(parseInt(req.query.startDate)),
    endDate = moment(parseInt(req.query.endDate)),
    days = endDate.diff(startDate, 'days'),
    curId = req.query.id,
    curDate = startDate.format('YYYY-MM-DD');
  for (var i = 0, j = 0; i < days; i++) {
    var tmpData = null;
    async.waterfall([
      function(cb) {
        tmpData = {
          "SCENE_ID": parseInt(curId),
          "RN": i + 1,
          "LINK": 0,
          "TEL": 0,
          "DATA": 0,
          "SHOW": 0,
          "S_WX_TIMELINE": 0,
          "S_WX_GROUP": 0,
          "S_WX_SINGLE": 0,
          "S_MOBILE": 0,
          "STAT_DATE": curDate
        };
        startDate = startDate.add(1, 'days');
        curDate = startDate.format('YYYY-MM-DD');
        cb(null, tmpData);
      },
      function(tmpData, cb) {
        dbutils.count('xl_dial_data', 'sceneid=? And to_days(dialtime)=to_days(?)', [tmpData.SCENE_ID, tmpData.STAT_DATE], function(err, c) {
          tmpData.TEL = c;
          cb(null, tmpData);
        });
      },
      function(tmpData, cb) {
        dbutils.count('xl_customer_data', 'sceneid=? And to_days(submittime)=to_days(?)', [tmpData.SCENE_ID, tmpData.STAT_DATE], function(err, c) {
          tmpData.DATA = c;
          cb(null, tmpData);
        });
      },
      function(tmpData, cb) {
        dbutils.count('xl_pv_data', 'sceneid=? And to_days(statdate)=to_days(?)', [tmpData.SCENE_ID, tmpData.STAT_DATE], function(err, c) {
          tmpData.SHOW = c;
          cb(null, tmpData);
        });
      },
      function(tmpData, cb) {
        dbutils.count('xl_pv_data', 'sceneid=? And statfrom=? And to_days(statdate)=to_days(?)', [tmpData.SCENE_ID, 'timeline', tmpData.STAT_DATE], function(err, c) {
          tmpData.S_WX_TIMELINE = c;
          cb(null, tmpData);
        });
      },
      function(tmpData, cb) {
        dbutils.count('xl_pv_data', 'sceneid=? And statfrom=? And to_days(statdate)=to_days(?)', [tmpData.SCENE_ID, 'groupmessage', tmpData.STAT_DATE], function(err, c) {
          tmpData.S_WX_GROUP = c;
          cb(null, tmpData);
        });
      },
      function(tmpData, cb) {
        dbutils.count('xl_pv_data', 'sceneid=? And statfrom=? And to_days(statdate)=to_days(?)', [tmpData.SCENE_ID, 'singlemessage', tmpData.STAT_DATE], function(err, c) {
          tmpData.S_WX_SINGLE = c;
          cb(null, tmpData);
        });
      },
      function(tmpData, cb) {
        dbutils.count('xl_pv_data', 'sceneid=? And statfrom!=? And to_days(statdate)=to_days(?)', [tmpData.SCENE_ID, '', tmpData.STAT_DATE], function(err, c) {
          tmpData.S_MOBILE = c;
          cb(null, tmpData);
        });
      }
    ], function(err, results) {
      if (results) {
        j++;
        data.push(results);
      }
      if (j == days) {
        var data2 = [];
        for (var k = 1; k <= data.length; k++) {
          for (var l = 0; l < data.length; l++) {
            if (data[l].RN == k) data2.push(data[l]);
          }
        }
        return res.jsonp({
          "success": true,
          "code": 200,
          "msg": "操作成功",
          "obj": null,
          "map": {
            "count": 1,
            "pageNo": parseInt(req.query.pageNo || 1),
            "pageSize": parseInt(req.query.pageSize)
          },
          "list": data2
        });
      }
    });
  }
});

// 获取最新消息
router.get('/getNewMessage', function(req, res) {
  var where = "type=2";
  if (req.query.unread) where += " And status=1";
  if (req.query.bizType) where += " And biztype=1";
  where += " And (touser='" + req.session.user.id + "' Or touser='0')";
  dbutils.getPageInfo('xl_message', where, null, {
    "pageNo": req.query.pageNo,
    "pageSize": req.query.pageSize
  }, function(err, results) {
    var data = [],
      rows = results.data;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "type": rows[i].type,
          "bizType": rows[i].biztype,
          "toUser": rows[i].touser,
          "toEmail": rows[i].toemail,
          "fromUser": rows[i].fromuser,
          "title": rows[i].title,
          "content": rows[i].content,
          "status": rows[i].status,
          "ext": rows[i].ext,
          "roleIdList": rows[i].roleidlist,
          "sendTime": rows[i].sendtime ? new Date(rows[i].sendtime).getTime() : null
        };
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

// 把消息设为已读
router.post('/markRead', function(req, res) {
  var ids = req.query.ids;
  if (ids) {
    dbutils.update('xl_message', {
      "status": 0,
      "id": req.query.ids
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

// 获取金币日志信息
router.get('/getXdlog', function(req, res) {
  dbutils.getPageInfo('xl_gold_log', 'username=?', req.session.user.name, {
    "pageNo": req.query.pageNo,
    "pageSize": req.query.pageSize
  }, function(err, results) {
    var data = [],
      rows = results.data;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "bizType": rows[i].biztype,
          "bizTitle": rows[i].biztitle,
          "xd": rows[i].xd,
          "remark": rows[i].remark,
          "optTime": rows[i].opttime ? new Date(rows[i].opttime).getTime() : null
        };
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

// 获取用户金币
router.get('/getUserXd', function(req, res) {
  dbutils.getInfo('xl_user', 'id=?', req.session.user.id, function(err, results) {
    if (results.length) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": results[0].xd,
        "map": null,
        "list": null
      });
    }
  });
});

// 获取金币统计信息
router.get('/getXdStat', function(req, res) {
  var tmpData = null;
  async.waterfall([
    function(cb) {
      tmpData = {
        "add": 0,
        "give": 0,
        "pay": 0
      };
      cb(null, tmpData);
    },
    function(tmpData, cb) {
      dbutils.sum('xl_gold_log', 'xd', 'username=? And biztype=?', [req.session.user.name, 'add'], function(err, c) {
        if (c) tmpData.add = c;
        else tmpData.add = 0;
        cb(null, tmpData);
      });
    },
    function(tmpData, cb) {
      dbutils.sum('xl_gold_log', 'xd', 'username=? And biztype=?', [req.session.user.name, 'give'], function(err, c) {
        if (c) tmpData.give = c;
        else tmpData.give = 0;
        cb(null, tmpData);
      });
    },
    function(tmpData, cb) {
      dbutils.sum('xl_gold_log', 'xd', 'username=? And biztype=?', [req.session.user.name, 'pay'], function(err, c) {
        if (c) tmpData.pay = c;
        else tmpData.pay = 0;
        cb(null, tmpData);
      });
    }
  ], function(err, results) {
    if (results) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": null,
        "map": results,
        "list": null
      });
    }
  });
});

// 转送金币
router.post('/giveXd', function(req, res) {
  var toUser = req.query.toUser,
    xdCount = parseInt(req.query.xdCount);
  dbutils.getInfo('xl_user', 'id=?', req.session.user.id, function(err, results) {
    if (results.length) {
      var userXd = parseInt(results[0].xd);
      if (userXd >= xdCount) {
        async.waterfall([
          function(cb) {
            dbutils.insert('xl_gold_log', {
              "biztype": "give",
              "biztitle": "转送",
              "remark": "转送金币给" + toUser,
              "xd": xdCount,
              "username": req.session.user.name,
              "opttime": utils.formatDT()
            }, function(err, results) {
              if (results.length) cb(null, 1);
              else cb(null, 0);
            });
          },
          function(b, cb) {
            dbutils.insert('xl_gold_log', {
              "biztype": "add",
              "biztitle": "获得",
              "remark": "用户" + req.session.user.name + "转送获得",
              "xd": xdCount,
              "username": toUser,
              "opttime": utils.formatDT()
            }, function(err, results) {
              if (results.length && b) cb(null, 1);
              else cb(null, 0);
            });
          },
          function(b, cb) {
            dbutils.execsql('update xl_user set xd=xd-? where id=?', [xdCount, req.session.user.id], function(err, results) {
              if (results.affectedRows && b) cb(null, 1);
              else cb(null, 0);
            });
          },
          function(b, cb) {
            dbutils.execsql('update xl_user set xd=xd+? where loginname=?', [xdCount, toUser], function(err, results) {
              if (results.affectedRows && b) cb(null, 1);
              else cb(null, 0);
            });
          }
        ], function(err, b) {
          if (b) {
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
          "success": true,
          "code": 1003,
          "msg": "用户金币不足",
          "obj": null,
          "map": null,
          "list": null
        });
      }
    }
  });
});

// =========== 以下部分暂无具体业务逻辑 ===========

// 更新页面模板子标签
router.post('/setPageChildLabel', function(req, res){
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

// 获取所有分账号
router.get('/getBranches', function(req, res) {
  // 暂无具体逻辑
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": {
      "count": 0,
      "pageNo": parseInt(req.query.pageNo),
      "pageSize": parseInt(req.query.pageSize)
    },
    "list": []
  });
});

// 添加分账号
router.post('/createBranch', function(req, res) {
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

// 更新分账号
router.post('/updateBranch', function(req, res) {
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

// 开启与关闭分账号
router.post('/setBranch', function(req, res) {
  // req.query.status 0,1
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

// 获取用户部门列表
router.get('/getDepts', function(req, res) {
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

// 添加用户部门
router.post('/addDept', function(req, res) {
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

// 获取企业用户信息
router.get('/getCompanyInfo', function(req, res) {
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

// 保存企业用户信息
router.post('/saveCompanyInfo', function(req, res) {
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

// 生成企业模板
router.post('/saveCompanyTpl', function(req, res) {
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

// 生成企业样例
router.post('/createCompanyTpls', function(req, res) {
  // 暂无具体逻辑
  // req.query.id
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": null,
    "list": null
  });
});

// 清除企业样例
router.post('/clearCompanyTpls', function(req, res) {
  // 暂无具体逻辑
  // req.query.id
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": null,
    "list": null
  });
});

// 获取企业样例
router.get('/getCompanyTpls', function(req, res) {
  // 暂无具体逻辑
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": {
      "count": 0,
      "pageNo": parseInt(req.query.pageNo),
      "pageSize": parseInt(req.query.pageSize)
    },
    "list": []
  });
});

// 获取扩展网址列表
router.get('/getWebList', function(req, res) {
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

// 更新扩展网址名称
router.post('/updateWebName', function(req, res) {
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

// 删除扩展网址
router.post('/deleteWeb', function(req, res) {
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
