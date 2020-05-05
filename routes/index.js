var express = require('express');
var User = require('../model/user');

var router = express.Router();

var session = require('express-session');
var findOrCreate = require('mongoose-findorcreate');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var _ = require('lodash');

router.use(passport.initialize());
router.use(passport.session());

router.get('/',function(req , res, next){
  res.render('index');
});

router.get('/login',function(req , res){
  res.render("login");
});

router.get('/manual_index',function(req,res){
  res.render('manual/manual_index');
});

router.get('/manual_login',function(req,res){
  res.render('manual/manual_login');
});

router.get('/manual_mypage',function(req,res){
  res.render('manual/manual_mypage');
});

router.get('/manual_new',function(req,res){
  res.render('manual/manual_new');
});

router.get('/manual_show',function(req,res){
  res.render('manual/manual_show');
});

router.get('/manual_detail',function(req,res){
  res.render('manual/manual_detail');
});

router.get('/manual_together',function(req,res){
  res.render('manual/manual_together');
});

// passport 및 암호화(hash)를 통한 로그인
// passport 처음에 로그인헀을때 실행 4
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// passport 첫 로그인 이후 3
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    return done(err, user);
  });
});

// passport facebook 규칙에 따라 실행 2
passport.use(new FacebookStrategy({
    clientID: '154169508522142',
    clientSecret: 'a25db28bfba87f623f228ab91b7ef45a',
    callbackURL: "/login/auth/facebook/callback",
    profileFields:['id','email','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    // 수정 필요
    // profile : 페이스북 상에서의 id가 담겨있다.
    
    var a = profile.emails;
    User.findOrCreate({facebook_id: profile.id, name : profile.displayName }, function(err, user) {
      if (err) {
       
        return done(err);
      }
      done(null, user);
    });
  }
));

// passport facebook 첫번째로 실행 1
router.get('/login/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// passport facebook callbackURL로 인증 실행 3
router.get('/login/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: 'back',
    failureFlash : true // allow flash messages
}),(req, res, next) => {
    req.flash('success', 'Welcome!');
    res.redirect('/');
  }
);

// 로그아웃
router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', '로그아웃 되었습니다.');
  res.redirect('/');
});

// AWS upload
// 1. 아래의 AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY 는 
//    AWS의 IAM에서 새로운 사용자를 추가해서 받아야 함!
// 2. S3_BUCKET은 AWS의 S3에서 새로 생성해서 만들어야 함
// 3. S3 bucket은 CORS 설정이 필요함
// 4. IAM의 user에게는 S3를 access할 수 있는 permission을 줘야 함!

//=============================
// 환경변수 설정방법
//=============================
// for Mac
// export AWS_ACCESS_KEY_ID=AKIAI3SWZQ2T????????
// export AWS_SECRET_ACCESS_KEY=Z3d??????????V637h1aDwNMFCIQYRGgL4lpuu+I
// export S3_BUCKET=mjoverflow

// for PC
// set AWS_ACCESS_KEY_ID=AKIAI3SWZQ2T???????? 
// set AWS_SECRET_ACCESS_KEY=Z3d??????????V637h1aDwNMFCIQYRGgL4lpuu+I
// set S3_BUCKET=mjoverflow

// for HEROKU
// heroku config:set AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=yyy
// heroku config:set S3_BUCKET=mjoverflow

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
const uuidv4 = require('uuid/v4');

router.get('/s3', function(req, res, next) {
  const s3 = new aws.S3({region: 'ap-northeast-2'});
  const filename = req.query.filename;
  const type = req.query.type;
  const uuid = uuidv4();
  const params = {
    Bucket: S3_BUCKET,
    Key: uuid + '/' + filename,
    Expires: 900,
    ContentType: type,
    ACL: 'public-read'
  };
  console.log(params);
  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log(err);
      return res.json({err: err});
    }
    res.json({
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${uuid}/${filename}`
    });
  });
});

module.exports = router;
