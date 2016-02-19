var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');
var multiparty = require('connect-multiparty');
var settings = require('./settings');
var utils = require('./models/utils');
var index = require('./routes/index');
var main = require('./routes/main');
var file = require('./routes/file');
var view = require('./routes/view');
var admin = require('./routes/admin');
var app = express();

// disable x-powered-by
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// modify suffix
// app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/images/favicon.ico'));

// save req json data
app.use(function(req, res, next) {
  var reqData = [];
  var size = 0;
  req.on('data', function(data) {
    reqData.push(data);
    size += data.length;
  });
  req.on('end', function() {
    req.reqData = Buffer.concat(reqData, size);
  });
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// configure uploaddir
app.use(multiparty({
  uploadDir: './public/uploadfiles/temp',
  keepExtensions: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure session
app.use(session({
  secret: settings.cookieSecret,
  // cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.admin = req.session.admin;
  res.locals.message = '';
  var err = req.session.error;
  delete req.session.error;
  if (err) res.locals.message = err;
  next();
});

app.use('/', index);
app.use('/view', view);
app.use('/m', utils.chkLogin, main);
app.use('/file', utils.chkLogin, file);
app.use('/admin', function(req, res, next) {
  if (req.path != '/login' && req.path != '/logout') {
    if (!req.session.admin) {
      req.session.error = 'Access denied';
      res.redirect('/admin/login');
    } else {
      next();
    }
  } else if (req.path == "/") {
    res.redirect('/admin/index');
  } else {
    next();
  }
}, admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
      res.render('404');
    } else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('404');
  } else {
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
});

module.exports = app;