var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var os = require('os');
var fs = require('fs');
var request = require('request');
var utils = require('../models/utils');
var dbutils = require('../models/mysql-utils');
var syscfg = {};

module.exports = router;

// 保存管理日志
function addLog(req, res, s1, s2) {
  syscfg = utils.getSysCfg();
  if (syscfg.logStatus || s1 === 'Login') {
    dbutils.insert('xl_manager_log', {
      "username": req.session.admin.name,
      "actiontype": s1 || req.path,
      "remark": s2 || null,
      "ip": utils.getIp(req),
      "createtime": utils.getFormatDT()
    });
  }
}

// 登录
router.route('/login')
  .get(function(req, res) {
    res.locals.admin = {
      "id": 1,
      "name": "llcowry",
      "nickname": "测试管理员"
    };
    req.session.admin = res.locals.admin;
    if (req.session.admin) res.redirect('/admin/index');
    syscfg = utils.getSysCfg();
    res.render('admin/login', {
      title: syscfg.webTitle + '-管理员登录',
      webname: syscfg.webName
    });
  })
  .post(function(req, res) {
    var userName = req.body.username;
    dbutils.getInfo('xl_manager', 'username=?', userName, function(err, results) {
      if (results == '') {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "用户名不存在！"
        });
      } else if (!results[0].status) {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "此用户已被锁定！"
        });
      }
      var userPwd = crypto.createHash('md5').update(req.body.password).digest('hex');
      if (results[0].username != userName || results[0].userpass != userPwd) {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "用户名或密码错误！"
        });
      } else {
        res.locals.admin = {
          "id": results[0].id,
          "name": results[0].username,
          "nickname": results[0].nickname
        };
        req.session.admin = res.locals.admin;
        addLog(req, res, 'Login', '登录成功');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "登录成功！",
          "url": "/admin/index"
        });
      }
    });
  });

// 注销
router.get('/logout', function(req, res) {
  addLog(req, res, 'Logout', '注销登录');
  req.session.destroy(function() {
    res.redirect('/admin/login');
  });
});

// 检测
router.post('/check', function(req, res) {
  var act = req.query.act,
    act = act.toLowerCase();
  switch (act) {
    case "manager_validate":
      dbutils.count('xl_manager', 'username=?', req.body.param, function(err, results) {
        if (results > 0) {
          return res.jsonp({
            "info": "此管理员已存在！",
            "status": "n"
          });
        } else {
          return res.jsonp({
            "info": "管理员可使用！",
            "status": "y"
          });
        }
      });
      break;
    case "user_validate":
      dbutils.count('xl_user', 'loginname=?', req.body.param, function(err, results) {
        if (results > 0) {
          return res.jsonp({
            "info": "此用户名已存在！",
            "status": "n"
          });
        } else {
          return res.jsonp({
            "info": "用户名可使用！",
            "status": "y"
          });
        }
      });
    case "scenetag_validate":
      if (req.body.param === req.query.name) {
        return res.jsonp({
          "info": "类别名称可使用！",
          "status": "y"
        });
      }
      dbutils.count('xl_scene_tag', 'name=?', req.body.param, function(err, results) {
        if (results > 0) {
          return res.jsonp({
            "info": "此类别名称已存在！",
            "status": "n"
          });
        } else {
          return res.jsonp({
            "info": "类别名称可使用！",
            "status": "y"
          });
        }
      });
      break;
  }
});

// 后台首页
router.get('/index', function(req, res) {
  syscfg = utils.getSysCfg();
  dbutils.getInfo('xl_back_nav', 'status=1', null, function(err, results) {
    var data = [];
    if (!err) data = results;
    res.render('admin/index', {
      title: syscfg.webTitle + '-管理中心',
      navData: data
    });
  });
});

// 获取导航列表
router.post('/index/nav_list', function(req, res) {
  dbutils.getInfo('xl_back_nav', 'status=1', null, function(err, results) {
    var data = [];
    if (!err) data = results;
    return res.jsonp(data);
  });
});

// 管理中心
router.get('/center', function(req, res) {
  syscfg = utils.getSysCfg();
  dbutils.execsql('Select ip,createtime From xl_manager_log Where username=? And actiontype=? Order By id Desc Limit 2', [req.session.admin.name, 'Login'], function(err, results) {
    if (results.length) {
      res.render('admin/center', {
        webName: syscfg.webName,
        webUrl: syscfg.webUrl,
        sysEmail: syscfg.sysMail.user,
        hostName: os.hostname(),
        osType: os.type() + ' ' + os.arch(),
        webStatus: syscfg.webStatus,
        curIp: utils.getIp(req),
        lastLoginIp: results[1].ip,
        lastLoginTime: utils.formatDT(results[1].createtime)
      });
    }
  });
});

// 系统设置
router.route('/sys/config')
  .get(function(req, res) {
    syscfg = utils.getSysCfg();
    res.render('admin/config', {
      title: syscfg.webTitle + '-系统设置',
      webname: syscfg.webName,
      weburl: syscfg.webUrl,
      webtitle: syscfg.webTitle,
      webkey: syscfg.webKey,
      webdes: syscfg.webDes,
      webicp: syscfg.webIcp,
      logstatus: !syscfg.logStatus ? '' : ' checked',
      webstatus: !syscfg.webStatus ? '' : ' checked',
      webclosereason: syscfg.webCloseReason,
      wxappid: syscfg.wxAppId,
      wxappsecret: syscfg.wxAppSecret,
      wxtoken: syscfg.wxToKen,
      qqappid: syscfg.qqAppId,
      mailsmtp: syscfg.sysMail.service,
      mailssl: !syscfg.sysMail.ssl ? '' : ' checked',
      mailport: syscfg.sysMail.port,
      mailuser: syscfg.sysMail.user,
      mailpass: syscfg.sysMail.pass
    });
  })
  .post(function(req, res) {
    var data = {
      "webName": req.body.webName,
      "webUrl": req.body.webUrl,
      "webTitle": req.body.webTitle,
      "webKey": req.body.webKey,
      "webDes": req.body.webDes,
      "webIcp": req.body.webIcp,
      "logStatus": !req.body.logStatus ? false : true,
      "webStatus": !req.body.webStatus ? false : true,
      "webCloseReason": req.body.webCloseReason,
      "wxAppId": req.body.wxAppId,
      "wxAppSecret": req.body.wxAppSecret,
      "wxToKen": req.body.wxToKen,
      "qqAppId": req.body.qqAppId,
      "sysMail": {
        "service": req.body.mailSmtp,
        "ssl": !req.body.mailSsl ? false : true,
        "port": parseInt(req.body.mailPort),
        "user": req.body.mailUser,
        "pass": req.body.mailPass
      }
    };
    fs.writeFile('syscfg.json', JSON.stringify(data), function(err) {
      if (err) {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      } else {
        addLog(req, res, '', '编辑系统设置');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/sys/config"
        });
      }
    });

  });

// 管理员管理
router.route('/manager/list')
  .get(function(req, res) {
    res.render('admin/manager_list');
  })
  .post(function(req, res) {
    var where = '1=1',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 10;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And (username Like '%" + unescape(keyword) + "%' Or nickname Like '%" + unescape(keyword) + "%')";
    dbutils.getPageInfo('xl_manager', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "userName": curRow.username,
            "nickName": curRow.nickname,
            "status": !curRow.status ? "锁定" : "正常",
            "createTime": utils.formatDT(curRow.createtime)
          };
        }
      }
      return res.jsonp({
        "success": true,
        "code": 1,
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

// 删除管理员
router.post('/manager/del', function(req, res) {
  var id = req.query.id + ',',
    ids = id.split(',');
  ids = utils.removeArrVal(ids, '1'); // 排除超管
  ids = utils.removeArrVal(ids, req.session.admin.id.toString()); // 排除自身
  if (ids.length) {
    ids = ids.join(',');
    ids = ids.substring(0, ids.length - 1);
    dbutils.delInfo('xl_manager', 'id In (' + ids + ')', null, function(err, results) {
      if (results.affectedRows) {
        addLog(req, res, '', '删除管理员');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/manager/list"
        });
      }
    });
  } else {
    return res.jsonp({
      "success": false,
      "code": 0,
      "msg": "操作失败！"
    });
  }
});

// 添加管理员
router.route('/manager/add')
  .get(function(req, res) {
    res.render('admin/manager_set', {
      title: '添加管理员',
      action: 'add',
      admin: {
        "name": '',
        "password": '',
        "nickname": '',
        "status": ' checked'
      }
    });
  })
  .post(function(req, res) {
    var userName = req.body.txtUserName;
    var userPwd = crypto.createHash('md5').update(req.body.txtPassword).digest('hex');
    dbutils.insert('xl_manager', {
      "username": userName,
      "userpass": userPwd,
      "nickname": req.body.txtNickName,
      "status": !req.body.status ? 0 : 1,
      "createtime": utils.getFormatDT()
    }, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '添加管理员');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/manager/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 编辑管理员
router.route('/manager/edit')
  .get(function(req, res) {
    dbutils.getInfo('xl_manager', 'id=?', req.query.id, function(err, results) {
      if (results.length) {
        res.render('admin/manager_set', {
          title: '编辑管理员',
          action: 'edit?id=' + req.query.id,
          admin: {
            "name": results[0].username,
            "password": '0|0|0|0|0',
            "nickname": results[0].nickname,
            "status": !results[0].status ? '' : ' checked'
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var data = {
      "nickname": req.body.txtNickName,
      "status": !req.body.status ? false : true,
      "id": req.query.id
    }
    var userPwd = req.body.txtPassword;
    if (userPwd != '0|0|0|0|0') {
      data.userpass = crypto.createHash('md5').update(userPwd).digest('hex');
    }
    dbutils.update('xl_manager', data, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '编辑管理员');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/manager/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 管理日志
router.route('/manager_log/list')
  .get(function(req, res) {
    res.render('admin/manager_log');
  })
  .post(function(req, res) {
    var where = '1=1',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 10;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And (username Like '%" + unescape(keyword) + "%' Or remark Like '%" + unescape(keyword) + "%')";
    where += ' Order By id Desc';
    dbutils.getPageInfo('xl_manager_log', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "userName": curRow.username,
            "actionType": curRow.actiontype,
            "remark": curRow.remark,
            "ip": curRow.ip,
            "createTime": utils.formatDT(curRow.createtime)
          };
        }
      }
      return res.jsonp({
        "success": true,
        "code": 1,
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

// 删除管理日志
router.post('/manager_log/del', function(req, res) {
  dbutils.delInfo('xl_manager_log', 'to_days(NOW())-to_days(createtime)>7', null, function(err, results) {
    if (results.affectedRows) {
      addLog(req, res, '', '删除管理日志');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/manager_log/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 会员审核管理
router.route('/user/audit_list')
  .get(function(req, res) {
    res.render('admin/user_audit');
  })
  .post(function(req, res) {
    var where = 'status=3',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 8;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And (loginname Like '%" + unescape(keyword) + "%' Or phone Like '%" + unescape(keyword) + "%' Or qq Like '%" + unescape(keyword) + "%')";
    where += ' Order By id Desc';
    dbutils.getPageInfo('xl_user', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        var arrStatus = ['正常', '锁定', '待验证', '待审核'];
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "loginName": curRow.loginname,
            "name": curRow.name,
            "email": curRow.email,
            "phone": curRow.phone,
            "tel": curRow.tel,
            "qq": curRow.qq,
            "xd": curRow.xd,
            "headImg": curRow.headimg,
            "regTime": curRow.regtime ? utils.formatDT(curRow.regtime) : null,
            "status": arrStatus[curRow.status]
          };
        }
      }
      return res.jsonp({
        "success": true,
        "code": 1,
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

// 会员审核
router.post('/user/audit', function(req, res) {
  dbutils.update('xl_user', {
    "status": 0,
    "id": req.query.id
  }, function(err, results) {
    if (results.length) {
      addLog(req, res, '', '审核会员');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/user/audit_list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 会员管理
router.route('/user/list')
  .get(function(req, res) {
    res.render('admin/user_list');
  })
  .post(function(req, res) {
    var where = 'status=0',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 8;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And (loginname Like '%" + unescape(keyword) + "%' Or phone Like '%" + unescape(keyword) + "%' Or qq Like '%" + unescape(keyword) + "%')";
    dbutils.getPageInfo('xl_user', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        var arrStatus = ['正常', '锁定', '待验证', '待审核'];
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "loginName": curRow.loginname,
            "name": curRow.name,
            "email": curRow.email,
            "phone": curRow.phone,
            "tel": curRow.tel,
            "qq": curRow.qq,
            "xd": curRow.xd,
            "headImg": curRow.headimg,
            "regTime": curRow.regtime ? utils.formatDT(curRow.regtime) : null,
            "status": arrStatus[curRow.status]
          };
        }
      }
      return res.jsonp({
        "success": true,
        "code": 1,
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

// 删除会员
router.post('/user/del', function(req, res) {
  dbutils.delInfo('xl_user', 'id In (' + req.query.id + ')', null, function(err, results) {
    if (results.affectedRows) {
      addLog(req, res, '', '删除会员');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/user/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 添加会员
router.route('/user/add')
  .get(function(req, res) {
    res.render('admin/user_set', {
      title: '添加会员',
      action: 'add',
      user: {
        "status": 0,
        "loginName": '',
        "loginPwd": '',
        "name": '',
        "email": '',
        "headImg": 'images/defaultuser.jpg',
        "phone": '',
        "tel": '',
        "qq": '',
        "sex": 0,
        "xd": 0,
        "regTime": '-'
      }
    });
  })
  .post(function(req, res) {
    var userName = req.body.userName;
    var userPwd = crypto.createHash('md5').update(req.body.userPwd).digest('hex');
    dbutils.insert('xl_user', {
      "status": req.body.status,
      "loginName": userName,
      "loginPwd": userPwd,
      "name": req.body.name,
      "email": req.body.email,
      "headImg": req.body.headImg,
      "phone": req.body.phone,
      "tel": req.body.tel,
      "qq": req.body.qq,
      "sex": req.body.sex,
      "xd": req.body.xd,
      "regTime": utils.getFormatDT()
    }, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '添加会员');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/user/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 编辑会员
router.route('/user/edit')
  .get(function(req, res) {
    dbutils.getInfo('xl_user', 'id=?', req.query.id, function(err, results) {
      if (results.length) {
        res.render('admin/user_set', {
          title: '编辑会员',
          action: 'edit?id=' + req.query.id,
          user: {
            "status": results[0].status,
            "loginName": results[0].loginname,
            "loginPwd": '0|0|0|0|0',
            "name": results[0].name,
            "email": results[0].email,
            "headImg": results[0].headimg,
            "phone": results[0].phone,
            "tel": results[0].tel,
            "qq": results[0].qq,
            "sex": results[0].sex,
            "xd": results[0].xd,
            "regTime": results[0].regtime ? utils.formatDT(results[0].regtime) : '-'
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var data = {
      "status": req.body.status,
      "loginname": req.body.userName,
      "name": req.body.name,
      "email": req.body.email,
      // "headimg": req.body.headImg, // 头像默认不能编辑
      "phone": req.body.phone,
      "tel": req.body.tel,
      "qq": req.body.qq,
      "sex": req.body.sex,
      "xd": req.body.xd,
      "id": req.query.id
    }
    var userPwd = req.body.userPwd;
    if (userPwd != '0|0|0|0|0') {
      data.loginpwd = crypto.createHash('md5').update(userPwd).digest('hex');
    }
    dbutils.update('xl_user', data, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '编辑会员');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/user/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 获取场景类型
router.get('/scene/type_data', function(req, res) {
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
      return res.jsonp(data);
    }
  });
});

// 场景管理
router.route('/scene/list')
  .get(function(req, res) {
    res.render('admin/scene_list');
  })
  .post(function(req, res) {
    var where = '1=1',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 8;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And (name Like '%" + unescape(keyword) + "%' Or description Like '%" + unescape(keyword) + "%')";
    dbutils.getPageInfo('Select s.*, t.name as tagname From xl_scene As s Left Join xl_scene_tag As t On s.biztype=t.id', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        var arrType = ['行业', '个人', '企业', '节假', '风格'];
        var arrPageMode = ['上下翻页', '上下惯性翻页', '左右翻页', '左右惯性翻页', '左右连续翻页'];
        var arrStatus = ['未发布', '开放', '关闭'];
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "name": curRow.name,
            "type": arrType[parseInt(curRow.type) - 101],
            "pageMode": arrPageMode[curRow.pagemode],
            "description": curRow.description,
            "bgAudio": !curRow.bgaudio ? null : JSON.parse(curRow.bgaudio),
            "imgSrc": !curRow.imgsrc ? 'images/defaultscene.png' : curRow.imgsrc,
            "hideEqAd": curRow.hideeqad ? !0 : !1,
            "isAdvancedUser": curRow.isadvanceduser ? !0 : !1,
            "lastPageId": curRow.lastpageid,
            "isTpl": curRow.istpl,
            "isPromotion": curRow.ispromotion,
            "status": arrStatus[curRow.status],
            "openLimit": curRow.openlimit,
            "startDate": curRow.startdate ? utils.formatDT(curRow.startdate) : '-',
            "endDate": curRow.enddate ? utils.formatDT(curRow.enddate) : '-',
            "createTime": curRow.createtime ? utils.formatDT(curRow.createtime) : '-',
            "updateTime": curRow.updatetime ? utils.formatDT(curRow.updatetime) : '-',
            "publishTime": curRow.publishtime ? utils.formatDT(curRow.publishtime) : '-',
            "applyTemplate": curRow.applytemplate,
            "applyPromotion": curRow.applypromotion,
            "sourceId": curRow.sourceid,
            "code": curRow.code,
            "sort": curRow.sort,
            "cover": curRow.cover,
            "property": !curRow.property ? "{}" : curRow.property,
            "bizType": !curRow.biztype ? '-' : curRow.tagname,
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

// 删除场景
router.post('/scene/del', function(req, res) {
  dbutils.delInfo('xl_scene', 'id In (' + req.query.id + ')', null, function(err, results) {
    if (results.affectedRows) {
      dbutils.delInfo('xl_scene_page', 'sceneid In (' + req.query.id + ')', null);
      addLog(req, res, '', '删除场景');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/scene/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 采集场景
router.route('/scene/collect')
  .get(function(req, res) {
    res.render('admin/scene_collect');
  })
  .post(function(req, res) {
    var sceneId = req.body.sceneid,
      sceneCode = utils.randomStr16(),
      scenePath = "uploadfiles/collect/" + sceneCode + "/",
      tpPath = scenePath + "tp/",
      bgPath = scenePath + "bg/",
      musicPath = scenePath + "music/",
      soundPath = scenePath + "sound/",
      data = {},
      obj = {},
      el = [];
    request({
      method: 'GET',
      uri: 'http://s1.eqxiu.com/eqs/s/' + sceneId,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
      }
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        data = JSON.parse(body);
        if (data.success) {
          obj = data.obj;
          list = data.list;
          if (obj.name === "场景链接不存在") {
            return res.jsonp({
              "success": false,
              "code": 0,
              "msg": "场景链接错误！"
            });
          }
          if (!fs.existsSync('public/' + scenePath)) fs.mkdirSync('public/' + scenePath);
          if (!fs.existsSync('public/' + tpPath)) fs.mkdirSync('public/' + tpPath);
          if (!fs.existsSync('public/' + bgPath)) fs.mkdirSync('public/' + bgPath);
          if (!fs.existsSync('public/' + musicPath)) fs.mkdirSync('public/' + musicPath);
          if (!fs.existsSync('public/' + soundPath)) fs.mkdirSync('public/' + soundPath);
          var type = parseInt(obj.type),
            pageMode = parseInt(obj.pageMode),
            cover = obj.image.imgSrc,
            bgAudio = obj.bgAudio;
          if (type > 105) obj.type = 101;
          if (pageMode > 7) obj.pageMode = 0;
          if (cover) {
            var coverPath = tpPath + utils.getFileName(cover);
            request('http://res.eqxiu.com/' + cover).pipe(fs.createWriteStream('public/' + coverPath));
            obj.cover = coverPath;
            obj.image.imgSrc = coverPath;
          }
          if (bgAudio) {
            bgAudio = JSON.parse(bgAudio);
            var audioPath = musicPath + utils.getFileName(bgAudio.url);
            request('http://res.eqxiu.com/' + bgAudio.url).pipe(fs.createWriteStream('public/' + audioPath));
            bgAudio.url = audioPath;
            obj.bgAudio = JSON.stringify(bgAudio);
          }
          dbutils.insert('xl_scene', {
            "name": obj.name,
            "type": obj.type,
            "pageMode": obj.pageMode,
            "description": obj.description,
            "imgSrc": obj.image.imgSrc,
            "cover": obj.cover,
            "bgAudio": obj.bgAudio,
            "isTpl": !obj.isTpl ? 0 : 1,
            "isPromotion": 1,
            "applyTemplate": !obj.applyTemplate ? 0 : 1,
            "applyPromotion": 1,
            "createTime": utils.formatTimestamp(obj.createTime),
            "updateTime": utils.formatTimestamp(obj.updateTime),
            "publishTime": utils.formatTimestamp(obj.publishTime),
            "code": sceneCode,
            "userloginname": null,
            "username": null,
            "createuser": 0
          }, function(err, results) {
            if (results.length) {
              var i, j, el, ct3Src, ct3Path, ct4Src, ct4Path, sound, csSrc, csPath;
              for (i = 0; i < list.length; i++) {
                el = list[i].elements;
                for (j = 0; j < el.length; j++) {
                  if (el[j]) {
                    switch (el[j].type.toString()) {
                      case "3":
                        ct3Src = el[j].properties.imgSrc;
                        if (ct3Src) {
                          ct3Path = bgPath + utils.getFileName(ct3Src);
                          request('http://res.eqxiu.com/' + ct3Src).pipe(fs.createWriteStream('public/' + ct3Path));
                          el[j].properties.imgSrc = ct3Path;
                        }
                        break;
                      case "4":
                        ct4Src = el[j].properties.src;
                        if (ct4Src) {
                          ct4Path = tpPath + utils.getFileName(ct4Src);
                          request('http://res.eqxiu.com/' + ct4Src).pipe(fs.createWriteStream('public/' + ct4Path));
                          el[j].properties.src = ct4Path;
                        }
                        break;
                    }
                    var sound = el[j].sound;
                    if (sound) {
                      csSrc = el[j].sound.src;
                      if (csSrc) {
                        csPath = soundPath + utils.getFileName(csSrc);
                        request('http://res.eqxiu.com/' + csSrc).pipe(fs.createWriteStream('public/' + csPath));
                        el[j].sound.src = csPath;
                      }
                    }
                  }
                }
                dbutils.insert('xl_scene_page', {
                  "sceneid": results[0].id,
                  "name": !list[i].name ? '第' + list[i].num + '页' : list[i].name,
                  "num": list[i].num,
                  "properties": list[i].properties,
                  "elements": JSON.stringify(el)
                });
              }
              addLog(req, res, '', '采集场景');
              return res.jsonp({
                "success": true,
                "code": 1,
                "msg": "操作成功！",
                "url": "/admin/scene/list"
              });
            } else {
              return res.jsonp({
                "success": false,
                "code": 0,
                "msg": "操作失败！"
              });
            }
          });
        } else {
          return res.jsonp({
            "success": false,
            "code": 0,
            "msg": data.msg
          });
        }
      }
    });
  });

// 场景审核管理
router.route('/scene/audit_list')
  .get(function(req, res) {
    dbutils.getInfo('(select id,name,value,type from xl_type where type=? order by sort) union (select id,name,biztype,type as value from xl_scene_tag where type=2)', '1=1', 'scene_type', function(err, results) {
      if (results.length) {
        res.render('admin/scene_audit', {
          tagData: results
        });
      }
    });
  })
  .post(function(req, res) {
    var where = 'applypromotion=0 And applytemplate=0',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 8;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And (name Like '%" + unescape(keyword) + "%' Or description Like '%" + unescape(keyword) + "%')";
    where += ' Order By id Desc';
    dbutils.getPageInfo('Select s.*, t.name as tagname From xl_scene As s Left Join xl_scene_tag As t On s.biztype=t.id', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        var arrType = ['行业', '个人', '企业', '节假', '风格'];
        var arrPageMode = ['上下翻页', '上下惯性翻页', '左右翻页', '左右惯性翻页', '左右连续翻页'];
        var arrStatus = ['未发布', '开放', '关闭'];
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "name": curRow.name,
            "type": arrType[parseInt(curRow.type) - 101],
            "pageMode": arrPageMode[curRow.pagemode],
            "description": curRow.description,
            "bgAudio": !curRow.bgaudio ? null : JSON.parse(curRow.bgaudio),
            "imgSrc": !curRow.imgsrc ? 'images/defaultscene.png' : curRow.imgsrc,
            "hideEqAd": curRow.hideeqad ? !0 : !1,
            "isAdvancedUser": curRow.isadvanceduser ? !0 : !1,
            "lastPageId": curRow.lastpageid,
            "isTpl": curRow.istpl,
            "isPromotion": curRow.ispromotion,
            "status": arrStatus[curRow.status],
            "openLimit": curRow.openlimit,
            "startDate": curRow.startdate ? utils.formatDT(curRow.startdate) : '-',
            "endDate": curRow.enddate ? utils.formatDT(curRow.enddate) : '-',
            "createTime": curRow.createtime ? utils.formatDT(curRow.createtime) : '-',
            "updateTime": curRow.updatetime ? utils.formatDT(curRow.updatetime) : '-',
            "publishTime": curRow.publishtime ? utils.formatDT(curRow.publishtime) : '-',
            "applyTemplate": curRow.applytemplate,
            "applyPromotion": curRow.applypromotion,
            "sourceId": curRow.sourceid,
            "code": curRow.code,
            "sort": curRow.sort,
            "cover": curRow.cover,
            "property": !curRow.property ? "{}" : curRow.property,
            "bizType": !curRow.biztype ? '-' : curRow.tagname,
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

// 移动场景
router.post('/scene/move', function(req, res) {
  dbutils.update('xl_scene', {
    "biztype": req.query.bizType,
    "id": req.query.id
  }, function(err, results) {
    addLog(req, res, '', '移动场景');
    if (results.length) {
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/scene/audit_list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 推荐场景
router.post('/scene/setpromotion', function(req, res) {
  dbutils.update('xl_scene', {
    "ispromotion": 1,
    "id": req.query.id
  }, function(err, results) {
    addLog(req, res, '', '推荐场景');
    if (results.length) {
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/scene/audit_list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 设置模板场景
router.post('/scene/settpl', function(req, res) {
  dbutils.update('xl_scene', {
    "istpl": 1,
    "id": req.query.id
  }, function(err, results) {
    if (results.length) {
      addLog(req, res, '', '设置模板场景');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/scene/audit_list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 场景类别管理
router.route('/scene_tag/list')
  .get(function(req, res) {
    res.render('admin/category_list');
  })
  .post(function(req, res) {
    dbutils.getInfo('xl_scene_tag', 'type=2 Order By biztype', null, function(err, results) {
      var data = [],
        c = results.length;
      if (c) {
        var arrType = ['行业', '个人', '企业', '节假', '风格'];
        for (var i = 0; i < c; i++) {
          var curRow = results[i];
          data[i] = {
            "id": curRow.id,
            "name": curRow.name,
            "bizType": arrType[parseInt(curRow.biztype) - 101]
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

// 删除场景类别
router.post('/scene_tag/del', function(req, res) {
  dbutils.delInfo('xl_scene_tag', 'id In (' + req.query.id + ')', null, function(err, results) {
    if (results.affectedRows) {
      addLog(req, res, '', '删除场景类别');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/scene_tag/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 添加场景类别
router.route('/scene_tag/add')
  .get(function(req, res) {
    dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'scene_type', function(err, results) {
      if (results.length) {
        var data = [];
        for (var i = 0; i < results.length; i++) {
          var curRow = results[i];
          data[i] = {
            "id": curRow.id,
            "name": curRow.name,
            "value": curRow.value
          };
        }
        res.render('admin/category_set', {
          title: '添加场景类别',
          action: 'add',
          sceneTag: {
            "name": '',
            "bizType": '',
            "typeData": data
          }
        });
      }
    });
  })
  .post(function(req, res) {
    dbutils.insert('xl_scene_tag', {
      "name": req.body.name,
      "bizType": req.body.bizType
    }, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '添加场景类别');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/scene_tag/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 编辑场景类别
router.route('/scene_tag/edit')
  .get(function(req, res) {
    dbutils.getInfo('xl_scene_tag', 'id=?', req.query.id, function(err, results) {
      if (results.length) {
        dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'scene_type', function(err, results2) {
          if (results2.length) {
            var data = [];
            for (var i = 0; i < results2.length; i++) {
              var curRow = results2[i];
              data[i] = {
                "id": curRow.id,
                "name": curRow.name,
                "value": curRow.value
              };
            }
            res.render('admin/category_set', {
              title: '编辑场景类别',
              action: 'edit?id=' + req.query.id,
              sceneTag: {
                "name": results[0].name,
                "bizType": results[0].biztype,
                "typeData": data
              }
            });
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var data = {
      "name": req.body.name,
      "bizType": req.body.bizType,
      "id": req.query.id
    };
    dbutils.update('xl_scene_tag', data, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '编辑场景类别');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/scene_tag/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 页面模板管理
router.route('/pagetpl/list')
  .get(function(req, res) {
    dbutils.getInfo('(select id,name,value,type from xl_type where type=? order by sort) union (select id,name,biztype,type as value from xl_scene_tag where type=1)', '1=1', 'tpl_page', function(err, results) {
      if (results.length) {
        res.render('admin/pagetpl_list', {
          tagData: results
        });
      }
    });
  })
  .post(function(req, res) {
    var where = '1=1',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 8;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And name Like '%" + unescape(keyword) + "%'";
    dbutils.getPageInfo('Select p.*, t.name as tagname From xl_scene_pagetpl As p Left Join xl_scene_tag As t On p.typeid=t.id', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        var arrType = ['版式', '互动', '风格'];
        var arrStatus = ['禁用', '正常'];
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "bizType": curRow.biztype === 1301 ? '-' : arrType[parseInt(curRow.biztype) - 1101],
            "tagName": curRow.typeid === 0 ? '-' : curRow.tagname,
            "name": !curRow.name ? '尾页' : curRow.name,
            "thumbSrc": !curRow.thumbsrc ? '' : curRow.thumbsrc,
            "useCount": curRow.usecount,
            "elements": !curRow.elements ? [] : JSON.parse(curRow.elements),
            "status": arrStatus[curRow.status]
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

// 删除页面模板
router.post('/pagetpl/del', function(req, res) {
  dbutils.delInfo('xl_scene_pagetpl', 'id In (' + req.query.id + ')', null, function(err, results) {
    if (results.affectedRows) {
      addLog(req, res, '', '删除页面模板');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/pagetpl/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 移动页面模板
router.post('/pagetpl/move', function(req, res) {
  dbutils.update('xl_scene_pagetpl', {
    "typeid": req.query.bizType,
    "id": req.query.id
  }, function(err, results) {
    addLog(req, res, '', '移动场景');
    if (results.length) {
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/pagetpl/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 编辑页面模板
router.route('/pagetpl/edit')
  .get(function(req, res) {
    dbutils.getInfo('xl_scene_pagetpl', 'id=?', req.query.id, function(err, results) {
      if (results.length) {
        var curRow = results[0];
        res.render('admin/pagetpl_set', {
          title: '编辑页面模板',
          action: 'edit?id=' + req.query.id,
          pageTpl: {
            "id": curRow.id,
            "bizType": curRow.biztype,
            "typeId": curRow.typeid,
            "name": curRow.name,
            "thumbSrc": !curRow.thumbsrc ? '' : curRow.thumbsrc,
            "elements": curRow.elements,
            "useCount": curRow.usecount,
            "sort": curRow.sort,
            "status": curRow.status
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var data = {
      "bizType": req.body.biztype,
      "typeId": req.body.typeid,
      "name": req.body.name,
      "thumbSrc": req.body.thumbSrc,
      "elements": req.body.content,
      "sort": req.body.sort,
      "status": req.body.status,
      "id": req.query.id
    };
    dbutils.update('xl_scene_pagetpl', data, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '编辑页面模板');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/pagetpl/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 页面模板类别管理
router.route('/pagetpl_tag/list')
  .get(function(req, res) {
    res.render('admin/category_list');
  })
  .post(function(req, res) {
    dbutils.getInfo('xl_scene_tag', 'type=1 Order By biztype', null, function(err, results) {
      var data = [],
        c = results.length;
      if (c) {
        var arrType = ['版式', '互动', '风格'];
        for (var i = 0; i < c; i++) {
          var curRow = results[i];
          data[i] = {
            "id": curRow.id,
            "name": curRow.name,
            "bizType": arrType[parseInt(curRow.biztype) - 1101]
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

// 删除页面模板类别
router.post('/pagetpl_tag/del', function(req, res) {
  dbutils.delInfo('xl_scene_tag', 'id In (' + req.query.id + ')', null, function(err, results) {
    if (results.affectedRows) {
      addLog(req, res, '', '删除页面模板类别');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/pagetpl_tag/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 添加页面模板类别
router.route('/pagetpl_tag/add')
  .get(function(req, res) {
    dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'tpl_page', function(err, results) {
      if (results.length) {
        var data = [];
        for (var i = 0; i < results.length; i++) {
          var curRow = results[i];
          data[i] = {
            "id": curRow.id,
            "name": curRow.name,
            "value": curRow.value
          };
        }
        res.render('admin/category_set', {
          title: '添加页面模板类别',
          action: 'add',
          sceneTag: {
            "name": '',
            "bizType": '',
            "typeData": data
          }
        });
      }
    });
  })
  .post(function(req, res) {
    dbutils.insert('xl_scene_tag', {
      "name": req.body.name,
      "bizType": req.body.bizType
    }, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '添加页面模板类别');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/pagetpl_tag/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 编辑页面模板类别
router.route('/pagetpl_tag/edit')
  .get(function(req, res) {
    dbutils.getInfo('xl_scene_tag', 'id=?', req.query.id, function(err, results) {
      if (results.length) {
        dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'tpl_page', function(err, results2) {
          if (results2.length) {
            var data = [];
            for (var i = 0; i < results2.length; i++) {
              var curRow = results2[i];
              data[i] = {
                "id": curRow.id,
                "name": curRow.name,
                "value": curRow.value
              };
            }
            res.render('admin/category_set', {
              title: '编辑页面模板类别',
              action: 'edit?id=' + req.query.id,
              sceneTag: {
                "name": results[0].name,
                "bizType": results[0].biztype,
                "typeData": data
              }
            });
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var data = {
      "name": req.body.name,
      "bizType": req.body.bizType,
      "id": req.query.id
    };
    dbutils.update('xl_scene_tag', data, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '编辑页面模板类别');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/pagetpl_tag/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 消息管理
router.route('/message/list')
  .get(function(req, res) {
    res.render('admin/message_list');
  })
  .post(function(req, res) {
    var where = 'type=2',
      keyword = req.query.keyword,
      pageNo = req.query.pageNo || 0,
      pageSize = req.query.pageSize || 10;
    pageNo = parseInt(pageNo) + 1;
    if (keyword) where += " And title Like '%" + unescape(keyword) + "%'";
    dbutils.getPageInfo('xl_message', where, null, {
      "pageNo": pageNo,
      "pageSize": pageSize
    }, function(err, results) {
      var data = [];
      if (results.data.length) {
        var arrType = ['', '系统通知', '审核通知', '活动通知'];
        for (var i = 0; i < results.data.length; i++) {
          var curRow = results.data[i];
          data[i] = {
            "id": curRow.id,
            "bizType": arrType[curRow.biztype],
            "fromUser": curRow.frmuser,
            "toUser": curRow.touser,
            "toEmail": curRow.toemail,
            "title": curRow.title,
            "status": !curRow.status ? "已读" : "未读",
            "sendTime": utils.formatDT(curRow.sendtime)
          };
        }
      }
      return res.jsonp({
        "success": true,
        "code": 1,
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

// 删除消息
router.post('/message/del', function(req, res) {
  dbutils.delInfo('xl_message', 'id In (' + req.query.id + ')', null, function(err, results) {
    if (results.affectedRows) {
      addLog(req, res, '', '删除消息');
      return res.jsonp({
        "success": true,
        "code": 1,
        "msg": "操作成功！",
        "url": "/admin/message/list"
      });
    } else {
      return res.jsonp({
        "success": false,
        "code": 0,
        "msg": "操作失败！"
      });
    }
  });
});

// 添加消息
router.route('/message/add')
  .get(function(req, res) {
    res.render('admin/message_set', {
      title: '添加消息',
      action: 'add',
      msgData: {},
      typeData: ['', '系统通知', '审核通知', '活动通知']
    });
  })
  .post(function(req, res) {
    dbutils.insert('xl_message', {
      "bizType": req.body.bizType,
      "title": req.body.title,
      "content": req.body.content
    }, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '添加消息');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/message/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });

// 编辑消息
router.route('/message/edit')
  .get(function(req, res) {
    dbutils.getInfo('xl_message', 'id=?', req.query.id, function(err, results) {
      if (results.length) {
        res.render('admin/message_set', {
          title: '编辑消息',
          action: 'edit?id=' + req.query.id,
          msgData: results[0],
          typeData: ['', '系统通知', '审核通知', '活动通知']
        });
      }
    });
  })
  .post(function(req, res) {
    var data = {
      "bizType": req.body.bizType,
      "title": req.body.title,
      "content": req.body.content,
      "id": req.query.id
    };
    dbutils.update('xl_message', data, function(err, results) {
      if (results.length) {
        addLog(req, res, '', '编辑消息');
        return res.jsonp({
          "success": true,
          "code": 1,
          "msg": "操作成功！",
          "url": "/admin/message/list"
        });
      } else {
        return res.jsonp({
          "success": false,
          "code": 0,
          "msg": "操作失败！"
        });
      }
    });
  });
