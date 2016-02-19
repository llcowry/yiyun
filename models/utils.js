var fs = require('fs'),
  Utils = function() {};

module.exports = Utils;

// 格式化日期
Date.prototype.format = function(s) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(s)) s = s.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(s)) {
      s = s.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return s;
};

// 返回数组的索引值
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};

// 删除数组中的指定元素
Utils.removeArrVal = function removeArrVal(arr, val) {
  var index = arr.indexOf(val);
  if (index > -1) {
    return arr.splice(index, 1);
  }
  return arr;
};

// 时间戳转日期
Utils.formatTimestamp = function formatTimestamp(s) {
  s = s || new Date().getTime();
  return new Date(parseInt(s)).format('yyyy-MM-dd hh:mm:ss');
};

// 时间戳转日期
Utils.formatDT = function formatDT(s) {
  return (s ? new Date(s) : new Date()).format('yyyy-MM-dd hh:mm:ss');
};

// 获取指定格式的日期
Utils.getFormatDT = function getFormatDT(s) {
  s = s || 'yyyy-MM-dd hh:mm:ss';
  return new Date().format(s);
};

// 生成随机字符
Utils.randomStr = function randomStr(len) {
  len = len || 32;
  var s = '',
    vchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefhijklmnopqrstuvwxyz',
    maxPos = vchars.length;
  for (i = 0; i < len; i++) {
    s += vchars.charAt(Math.floor(Math.random() * maxPos));　　
  }　　
  return s;
};

// 生成16位随机字符
Utils.randomStr16 = function randomStr16() {
  return new Date().getTime().toString(16) + Utils.randomStr(5);
};

// 生成随机文件名称
Utils.randomFileName = function randomFileName(s) {
  return new Date().getTime().toString(16) + Utils.randomStr(9) + '.' + s;
};

// 获取文件名称
Utils.getFileName = function getFileName(s) {
  return s.substr(s.lastIndexOf("/") + 1);
};

// 设定非阻塞
Utils.sleep = function sleep(ms) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + ms);
};

// 判断是否为手机
Utils.isMobile = function isMobile(req) {
  var a = !1,
    userAgent = req.headers['user-agent'].toLowerCase();
  return function(b) {
    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))) && (a = !0)
  }(userAgent), a;
};

// 获取用户IP
Utils.getIp = function getIp(req) {
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  if (ip.indexOf('::ffff:') != -1) ip = ip.substr(7);
  if (ip === '::1') ip = '127.0.0.1';
  return ip;
};

// 合并JSON对象
Utils.merge = function merge(source, target) {
  var len = arguments.length;
  if (len < 1) return;
  if (len < 2 || !arguments[1]) return arguments[0];
  var r = {};
  for (var i in source) {
    r[i] = source[i];
  }
  for (var j in target) {
    r[j] = target[j];
  }
  return r;
};

// 获取系统配置
Utils.getSysCfg = function getSysCfg() {
  return JSON.parse(fs.readFileSync("syscfg.json", "utf-8"));
};

// 设置Session
Utils.setSession = function setSession(req, res, user) {
  req.session.user = user;
  res.locals.user = req.session.user;
}

// 验证登录
Utils.chkLogin = function chkLogin(req, res, next) {
  // res.cookie('rememberMe', {
  //   "uid": 1,
  //   "username": "llcowry@126.com",
  //   "nickname": "llcowry"
  // }, {
  //   maxAge: 86400000
  // });
  if (req.cookies.rememberMe) {
    Utils.setSession(req, res, {
      "id": req.cookies.rememberMe.uid,
      "name": req.cookies.rememberMe.username,
      "nickname": req.cookies.rememberMe.nickname
    });
  }
  if (!req.session.user) {
    req.session.error = 'Access denied';
    return res.jsonp({
      "success": false,
      "code": 1001,
      "msg": "请先登录",
      "obj": null,
      "map": null,
      "list": null
    });
  } else {
    next();
  }
};