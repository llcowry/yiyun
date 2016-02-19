var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var async = require('async');
var images = require('images');
var utils = require('../models/utils');
var dbutils = require('../models/mysql-utils');

module.exports = router;

// 上传文件
router.post('/upload', function(req, res) {
  var file = req.files.file,
    fileName = file.name,
    fileExt = fileName.substr(fileName.indexOf(".") + 1),
    fileSize = file.size,
    filePath = null,
    tmbPath = null,
    fileType = req.query.fileType || 0;
  if (fileSize > 3 * 1024 * 1024) {
    fs.unlink(file.path, function() {
      return res.jsonp({
        "success": false,
        "code": 2001,
        "msg": "文件大小超过限制"
      });
    });
  }
  fileType = parseInt(fileType);
  switch (fileType) {
    case 0:
      filePath = "uploadfiles/bg/";
      break;
    case 1:
      filePath = "uploadfiles/tp/";
      break;
    case 2:
      filePath = "uploadfiles/music/";
      break;
  }
  filePath += utils.getFormatDT('yyyy-MM') + '/';
  if (!fs.existsSync('public/' + filePath)) fs.mkdirSync('public/' + filePath);
  if (fileType < 2) {
    tmbPath = filePath + utils.randomFileName(fileExt);
    var tmpfile = './' + file.path.replace(/\\/g, '/');
    if (fileType == 0) {
      images(tmpfile).resize(67, 113).save('public/' + tmbPath, {
        quality: 80
      });
    } else {
      images(tmpfile).resize(80, 80).save('public/' + tmbPath, {
        quality: 80
      });
    }
  }
  filePath += utils.randomFileName(fileExt);
  fs.rename(file.path, 'public/' + filePath, function(err) {
    if (err) {
      return res.jsonp({
        "success": false,
        "code": 2002,
        "msg": err.Message
      });
    }
    dbutils.insert('xl_uploadfile', {
      "name": fileName,
      "extname": fileExt,
      "filetype": fileType,
      "biztype": req.query.bizType,
      "path": filePath,
      "tmbpath": tmbPath,
      "size": fileSize,
      "status": 1,
      "createuser": req.session.user.id
    }, function(err, results) {
      if (results.length) {
        return res.jsonp({
          "success": true,
          "code": 200,
          "msg": "操作成功",
          "obj": {
            "id": results[0].id,
            "name": results[0].name,
            "extName": results[0].extname,
            "fileType": results[0].filetype,
            "bizType": results[0].biztype,
            "path": results[0].path,
            "tmbPath": results[0].tmbpath,
            "sort": results[0].sort,
            "size": results[0].size,
            "status": results[0].status
          },
          "map": null,
          "list": null
        });
      }
    });
  });
});

// 截取并保存图片
router.post('/cropImage', function(req, res) {
  var fileSrc = req.body.src,
    fileName = utils.getFileName(fileSrc),
    fileExt = fileName.substr(fileName.indexOf(".") + 1),
    filePath = "uploadfiles/tp/" + utils.getFormatDT('yyyy-MM') + '/',
    fileType = req.body.fileType || 1,
    x = parseInt(req.body.x),
    y = parseInt(req.body.y),
    w = parseInt(req.body.w),
    h = parseInt(req.body.h);
  fileIndex = req.body.index || 0;
  if (!fs.existsSync('public/' + filePath)) fs.mkdirSync('public/' + filePath);
  filePath += utils.randomFileName(fileExt);
  images(images('public/' + fileSrc), x, y, w, h).save('public/' + filePath);
  dbutils.insert('xl_uploadfile', {
    "name": fileName,
    "extname": fileExt,
    "filetype": fileType,
    "biztype": 0,
    "path": filePath,
    "tmbpath": filePath,
    "size": 0,
    "status": 1,
    "createuser": req.session.user.id
  }, function(err, results) {
    if (results.length) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": filePath,
        "map": {
          "id": results[0].id,
          "fileType": fileType,
          "path": filePath,
          "src": fileSrc,
          "x": req.body.x,
          "y": req.body.y,
          "w": req.body.w,
          "h": req.body.h,
          "index": fileIndex
        },
        "list": null
      });
    }
  });
});

// 删除文件
router.post('/deleteFile', function(req, res) {
  var arrId = req.body.id + ',';
  arrId = arrId.split(',');
  var n = arrId.length - 1;
  for (var i = 0, j = 0; i < n; i++) {
    var id = arrId[i];
    async.waterfall([
      function(cb) {
        dbutils.getInfo('xl_uploadfile', 'id=?', id, function(err, rows) {
          if (rows.length) cb(null, rows[0].path, rows[0].tmbpath, rows[0].id);
        });
      },
      function(filePath, tmbPath, fileId, cb) {
        if (fs.existsSync('public/' + filePath)) fs.unlinkSync('public/' + filePath), cb(null, tmbPath, fileId);
        // 同步执行
        // fs.exists('public/' + filePath, function(b) {
        //   if (b) {
        //     fs.unlink('public/' + filePath, function() {
        //       cb(null, tmbPath, fileId);
        //     });
        //   }
        // });
      },
      function(tmbPath, fileId, cb) {
        if (fs.existsSync('public/' + tmbPath)) fs.unlinkSync('public/' + tmbPath), cb(null, fileId);
      },
      function(fileId, cb) {
        dbutils.delInfo('xl_uploadfile', 'id=?', fileId, function(err, result) {
          if (result.affectedRows) cb(null, 1);
          else cb(null, 0);
        });
      }
    ], function(err, b) {
      if (b) j++;
      if (j == n) {
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

// 获取背景类别
router.get('/getBgType', function(req, res) {
  dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'bgType', function(err, results) {
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

// 获取图片类别
router.get('/getTpType', function(req, res) {
  dbutils.getInfo('xl_type', 'type=? And status=1 Order By sort', 'tpType', function(err, results) {
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

// 获取子类别
router.get('/getChildCategory', function(req, res) {
  // 因子分类已处理掉，所以此处返回null
  return res.jsonp({
    "success": true,
    "code": 200,
    "msg": "操作成功",
    "obj": null,
    "map": null,
    "list": []
  });
});

// 获取文件
router.get('/getFileByCategory', function(req, res) {
  var where = "status=1",
    vals = [];
  if (req.query.bizType) where += " And biztype=?", vals[vals.length] = req.query.bizType;
  if (req.query.fileType) where += " And filetype=?", vals[vals.length] = req.query.fileType;
  where += " Order By sort";
  dbutils.getPageInfo('xl_sysfile', where, vals, {
    "pageNo": req.query.pageNo || 1,
    "pageSize": req.query.pageSize || 10
  }, function(err, results) {
    var data = [],
      rows = results.data;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        data[i] = {
          "id": row.id,
          "name": row.name,
          "extName": row.extname,
          "fileType": row.filetype,
          "bizType": row.biztype,
          "path": row.path,
          "tmbPath": row.tmbpath,
          "sort": row.sort,
          "size": row.size,
          "status": row.status
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

// 获取我的文件
router.get('/getFilelistByTag', function(req, res) {
  var where = "status=1 And createuser=" + req.session.user.id,
    vals = [];
  if (req.query.fileType) where += " And filetype=?", vals[vals.length] = req.query.fileType;
  if (req.query.tagId) where += " And biztype=?", vals[vals.length] = req.query.tagId;
  where += " Order By sort";
  dbutils.getPageInfo('xl_uploadfile', where, vals, {
    "pageNo": req.query.pageNo,
    "pageSize": req.query.pageSize
  }, function(err, results) {
    var data = [],
      rows = results.data;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        data[i] = {
          "id": row.id,
          "name": row.name,
          "extName": row.extname,
          "fileType": row.filetype,
          "bizType": row.biztype,
          "path": row.path,
          "tmbPath": row.tmbpath,
          "sort": row.sort,
          "size": row.size,
          "status": row.status
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

// 获取自定义类别
router.get('/getCustomTags', function(req, res) {
  dbutils.getInfo('xl_uploadfile_tag', 'createuser=?', req.session.user.id, function(err, rows) {
    var data = [];
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        data[i] = {
          "id": rows[i].id,
          "name": rows[i].name,
          "bizType": rows[i].biztype,
          "createUser": rows[i].createuser,
          "createTime": !rows[i].createtime ? null : new Date(rows[i].createtime).getTime()
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

// 添加自定义类别
router.post('/createCustomTag', function(req, res) {
  dbutils.insert('xl_uploadfile_tag', {
    "name": req.body.tagName,
    "biztype": 0,
    "createtime": utils.formatTimestamp(new Date().getTime()),
    "createuser": req.session.user.id
  }, function(err, result) {
    if (result.length) {
      return res.jsonp({
        "success": true,
        "code": 200,
        "msg": "操作成功",
        "obj": result[0].id,
        "map": null,
        "list": null
      });
    }
  });
});

// 删除自定义类别
router.post('/deleteCustomTag', function(req, res) {
  dbutils.delInfo('xl_uploadfile_tag', "id=?", req.body.id, function(err, results) {
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

// 设置文件类别
router.post('/setFileTag', function(req, res) {
  dbutils.update('xl_uploadfile', {
    "biztype": req.body.tagId,
    "id": req.body.fileIds
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

// 取消设置文件类别
router.post('/unSetFileTag', function(req, res) {
  dbutils.update('xl_uploadfile', {
    "biztype": 0,
    "id": req.body.fileIds
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
