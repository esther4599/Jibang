// express framework
var express = require('express');
// path 
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// flash 
var flash = require('connect-flash');
// cookie
var cookieParser = require('cookie-parser');
// for POST method
var bodyParser = require('body-parser');
// mongodb 
var mongoose = require('mongoose');
// passport
var passport = require('passport');
// session
var session = require('express-session');
// facebook login
var FacebookStrategy = require('passport-facebook').Strategy;
// put method 와 delete method를 사용하게 해준다
var methodOverride = require('method-override');
// AWS SDK
var AWS = require('aws-sdk');
// 파일을 제어 하는 모듈
var formidable = require('formidable');

// 몽고 디비 연결
// mongodb connect
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://jibang:jibang123@ds015690.mlab.com:15690/jibang', { useMongoClient: true });
// mongoose.connect('mongodb://localhost', { useMongoClient: true });
mongoose.connection.on('error', console.log);

// 경로를 설정
var router = require('./routes/index');
var room = require('./routes/room');
var mypage = require('./routes/mypage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.pretty = true; // html예쁘게 만들기

// flash
app.use(flash());

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// public 정적으로 설정함
app.use(express.static(path.join(__dirname, '/public')));
app.use('/room', express.static(path.join(__dirname, 'public')));
app.use('/newroom', express.static(path.join(__dirname, 'public')));

// _method를 통해서 method를 변경할 수 있도록 함. PUT이나 DELETE를 사용할 수 있도록.
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

// session 설정
app.use(session({
  secure: true,
  resave:false,
  saveUninitialized:true,
  secret: 'asflknwlaern@lnfliunsdf*$^!@*#&$&!%@#ksadfasd2fsdg!@#$!@$ffjbfdsliubfsd123123f',
}));

// passport 설정
app.use(passport.initialize());
app.use(passport.session());

// 세션및 플레시 지역변수 설정
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

// app이 사용하도록 연결
app.use('/',router);
app.use('/room', room);
app.use('/mypage', mypage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
