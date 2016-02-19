var nodemailer = require('nodemailer'),
  settings = require('../settings'),
  transporter = null,
  mailHelper = function() {};

module.exports = mailHelper;

// 邮件发送
mailHelper.send = function send(opts, callback) {
  if (settings.sysMail.ssl) {
    transporter = nodemailer.createTransport({
      service: settings.sysMail.service,
      secureConnection: true,
      port: settings.sysMail.port,
      auth: settings.sysMail
    });
  } else {
    transporter = nodemailer.createTransport({
      service: settings.sysMail.service,
      auth: settings.sysMail
    });
  }
  transporter.sendMail(opts, function(err, res) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(err, res);
    }
  });
  transporter.close();
};