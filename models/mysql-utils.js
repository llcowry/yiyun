var mysql = require('mysql'),
  settings = require('../settings'),
  pool = null,
  DBUtils = function() {};

module.exports = DBUtils;

// 创建mysqlpool
pool = mysql.createPool({
  host: settings.mysql.host,
  port: settings.mysql.port,
  database: settings.mysql.name,
  user: settings.mysql.user,
  password: settings.mysql.pass
});

// 设置默认自增值
pool.on('connection', function(connection) {
  connection.query('SET SESSION auto_increment_increment=1');
});

// 创建连接
DBUtils.getConn = function getConn(callback) {
  if (!callback) callback = function() {};
  pool.getConnection(function(err, conn) {
    if (err) throw err;
    callback(conn);
  });
};

// 清空数据（无法回退）
DBUtils.clear = function update(tblname, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var sql = "TRUNCATE TABLE ??";
    conn.query(sql, [tblname], function(err) {
      if (err) {
        callback(err, res);
      } else {
        callback(null, res);
      }
      conn.release();
    });
  });
};

// 直接执行SQL
DBUtils.execsql = function execsql(sql, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var arrVal = [];
    if (typeof vals != "object") {
      arrVal[0] = vals;
    } else {
      arrVal = vals;
    }
    conn.query(sql, arrVal, function(err, res) {
      if (err) {
        callback(err, res);
      } else {
        callback(null, res);
      }
      conn.release();
    });
  });
};

// 插入数据
DBUtils.insert = function insert(tblname, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var sql = "Insert Into ?? Set ?";
    conn.query(sql, [tblname, vals], function(err, res) {
      if (err) {
        callback(err, null);
      } else {
        conn.query("Select * From ?? Where id=?", [tblname, res.insertId], function(err, res) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, res);
          }
          conn.release();
        });
      }
    });
  });
};

// 更新数据
DBUtils.update = function update(tblname, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var id = vals.id,
      sql = "Update ?? Set ? Where id=?";
    if (id.toString().indexOf(",") != -1) {
      sql = sql.replace("id=?", "id In (" + id + ")");
    } else if (typeof id == "object") {
      sql = sql.replace("id=?", "id In (" + id.join(",") + ")");
    } else {
      sql = sql.replace("id=?", "id=" + id);
    }
    delete vals.id;
    conn.query(sql, [tblname, vals], function(err) {
      if (err) {
        callback(err, null);
      } else {
        sql = "Select * From ?? Where "
        if (id.toString().indexOf(",") != -1) {
          sql += "id In (" + id + ")";
        } else if (typeof id == "object") {
          sql += "id In (" + id.join(",") + ")";
        } else {
          sql += "id=" + id;
        }
        conn.query(sql, [tblname], function(err, res) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, res);
          }
          conn.release();
        });
      }
    });
  });
};

// 删除数据
DBUtils.delInfo = function delInfo(tblname, where, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var sql = "Delete From " + tblname + " Where " + where,
      arrVal = [];
    if (typeof vals != "object") {
      arrVal[0] = vals;
    } else {
      arrVal = vals;
    }
    conn.query(sql, arrVal, function(err, res) {
      if (err) {
        callback(err, res);
      } else {
        callback(null, res);
      }
      conn.release();
    });
  });
};

// 根据条件获取总记录数
DBUtils.count = function count(tblname, where, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var sql, arrVal = [];
    if (tblname.toString().indexOf(' ') != -1) tblname = '(' + tblname + ') As tmpTbl';
    sql = "Select Count(1) As count From " + tblname + " Where " + where;
    if (typeof vals != "object") {
      arrVal[0] = vals;
    } else {
      arrVal = vals;
    }
    conn.query(sql, arrVal, function(err, res) {
      if (err) {
        callback(err, 0);
      } else {
        callback(null, res[0].count);
      }
      conn.release();
    });
  });
};

// 根据条件获取记录总和
DBUtils.sum = function sum(tblname, fields, where, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var sql, arrVal = [];
    if (tblname.toString().indexOf(' ') != -1) tblname = '(' + tblname + ') As tmpTbl';
    sql = "Select Sum(" + fields + ") As sum From " + tblname + " Where " + where;
    if (typeof vals != "object") {
      arrVal[0] = vals;
    } else {
      arrVal = vals;
    }
    conn.query(sql, arrVal, function(err, res) {
      if (err) {
        callback(err, 0);
      } else {
        callback(null, res[0].sum);
      }
      conn.release();
    });
  });
};

// 根据条件获取信息
DBUtils.getInfo = function getInfo(tblname, where, vals, callback) {
  if (!callback) callback = function() {};
  DBUtils.getConn(function(conn) {
    var sql, arrVal = [];
    if (tblname.toString().indexOf(' ') != -1) tblname = '(' + tblname + ') As tmpTbl';
    sql = "Select * From " + tblname + " Where " + where;
    if (typeof vals != "object") {
      arrVal[0] = vals;
    } else {
      arrVal = vals;
    }
    conn.query(sql, arrVal, function(err, res) {
      if (err) {
        callback(err, res);
      } else {
        callback(null, res);
      }
      conn.release();
    });
  });
};

// 根据条件获取分页信息
DBUtils.getPageInfo = function getPageInfo(tblname, where, vals, page, callback) {
  if (!callback) callback = function() {};
  DBUtils.count(tblname, where, vals, function(err, result) {
    if (err) {
      callback(err, result);
    } else {
      page.count = result;
      page.start = (page.pageNo - 1) * page.pageSize;
      page.totalPage = Math.ceil(page.count / page.pageSize);
      if (result) {
        DBUtils.getConn(function(conn) {
          var sql, arrVal = [];
          if (tblname.toString().indexOf(' ') != -1) tblname = '(' + tblname + ') As tmpTbl';
          sql = "Select * From " + tblname + " Where " + where + " Limit " + page.start + "," + page.pageSize;
          if (typeof vals != "object") {
            arrVal[0] = vals;
          } else {
            arrVal = vals;
          }
          conn.query(sql, arrVal, function(err, res) {
            if (err) {
              callback(err, res);
            } else {
              page.data = res;
              callback(null, page);
            }
            conn.release();
          });
        });
      } else {
        page.data = [];
        callback(null, page);
      }
    }
  });
};