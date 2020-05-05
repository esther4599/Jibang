var express = require('express');
var User = require('../model/user');
var Room = require('../model/room');
var After = require('../model/after');
const catchErrors = require('../lib/async-error');
var router = express.Router();

// 로그인을 확인 하는 코드
function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('danger', '로그인 먼저 해주세요~~');
      res.redirect('/login');
    }
}

// mypage index페이지
router.get('/', needAuth , catchErrors(async (req, res, next) => {
    rooms = await Room.find({ "user_id" :  req.user.id });
    res.render("users/index",{rooms : rooms} );      
}));

// 수정하는 페이지
router.get('/:id/edit', needAuth ,catchErrors(async (req, res, next) => {
    console.log(req.params.id);
    const room = await Room.findById(req.params.id);
    res.render("users/edit",{room : room});      
}));

// 수정한 것을 바꾸주는 페이지
router.put('/:id', needAuth ,catchErrors( async (req,res, next) => {
    const room = await Room.findById(req.params.id);

    room.title = req.body.title;
    room.locate = req.body.locate;
    room.type = req.body.type;
    room.time =req.body.time;
    room.size = req.body.size;
    room.security_money = req.body.security_money;
    room.monthly_rent = req.body.monthly_rent;
    room.management_expenses =req.body.management_expenses;
    room.electric =req.body.electric;
    room.water =req.body.water;
    room.gas =req.body.gas;
    room.address =req.body.address;
    room.detail_address = req.body.detail_address;
    room.option1 =req.body.option1;
    room.option2 =req.body.option2;
    room.option3 =req.body.option3;
    room.option4 =req.body.option4;
    room.option5 =req.body.option5;
    room.option6 =req.body.option6;
    room.etc_option =req.body.etc_option;
    room.phone_num =req.body.phone_num;
    room.addition_ex =req.body.addition_ex;
    room.img = req.body.img;

    await room.save();
    req.flash('success', '방 정보가 수정 되었습니다~');

    res.redirect('/mypage');
}));

// 방의 정보를 지우는 
router.delete('/:id' , needAuth ,catchErrors( async (req,res, next) =>{
    // 후기 댓글을 지움
    await After.find({room_id : req.params.id}).remove();  
    // AWS에 있는 이미지를 지움
    var room = await Room.findById(req.params.id);

    //방의 정보를 지움
    Room.findOneAndRemove({_id: req.params.id}, function(err) {
        if (err) {
          return next(err);
        }
        req.flash('success', '방 정보가 삭제 되었습니다~');
        res.redirect('/mypage');
    });
}));

module.exports = router;
