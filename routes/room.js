var express = require('express');
var User  = require('../model/user');
var Room = require('../model/room');
var After = require('../model/after');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// 선택된 지역을 저장하는 변수
var select_locate;

// 로그인을 확인 하는 코드
function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', '로그인 먼저 해주세요~~');
        res.redirect('/login');
    }
}

// 자리를 바꿔주는 함수
function swap(arr,i,j){
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// MAX heap을 만들어주는 함수
var heapify = function (arr , MAX , sort_type){
    for(let i = 0 ; i <  MAX ; i++){
        for(let k = i ; k >= 0 ; k--){
            var p = Math.floor(k / 2);
            switch(sort_type){
                case "title":
                    if(arr[k].title > arr[p].title){
                        swap(arr , k , p);
                    }
                    break;

                case "createdAt":
                    if(arr[k].createdAt > arr[p].createdAt){
                        swap(arr , k , p);
                    }
                    break;

                case "monthly_rent":
                    if(arr[k].monthly_rent > arr[p].monthly_rent){
                        swap(arr , k , p);
                    }
                    break;

            }
        }
    }
}
  
// heapsort함수
var heapSort = function (arr , sort_type){
    console.log(sort_type);
    var len = arr.length;
    heapify(arr , len , sort_type);
  
    for(let i = arr.length-1 ; i > 0  ; i--){
      swap(arr , 0 , i);
      len--;
      heapify(arr , len , sort_type);
    }
    return arr;
}

// 방 리스트
router.post('/',catchErrors(async (req , res , next) => {
    select_locate = req.body.locate;
    console.log(select_locate);
    var rooms = await Room.find({ "locate" :  select_locate }).populate('user_id');
    console.log(rooms);
    res.render("rooms/index",{rooms:rooms});      
}));


// sort 방 리스트
router.get('/', catchErrors(async (req,res,next)=>{
    var rooms = await Room.find({ "locate" :  select_locate }).populate('user_id');
    rooms = heapSort(rooms , req.query.sort);
    console.log(rooms);
    res.render("rooms/index",{rooms:rooms}); 
    //res.redirect('/room');
}));

router.get('/together', catchErrors(async (req,res,next) =>{
    var rooms = await Room.find({}).populate('user_id');
    if(req.query.sort){
        rooms = heapSort(rooms, req.query.sort);
    }
    res.render("rooms/together", {rooms : rooms});
}));


// 방 글쓰기
router.get('/new',needAuth, function(req , res, next){
    res.render("rooms/new" ,{room:{}});
});

// 방 글쓰기 post
router.post('/:id',needAuth,catchErrors(async (req , res ,next) =>{
    var room = new Room({
        user_id : req.user.id,
        title : req.body.title,
        locate : req.body.locate,
        type : req.body.type,
        time : req.body.time,
        size : req.body.size,
        security_money : req.body.security_money,
        monthly_rent : req.body.monthly_rent,
        management_expenses : req.body.management_expenses,
        electric : req.body.electric,
        water : req.body.water,
        gas : req.body.gas,
        address : req.body.address,
        detail_address : req.body.detail_address,
        option1 : req.body.option1,
        option2 : req.body.option2,
        option3 : req.body.option3,
        option4 : req.body.option4,
        option5 : req.body.option5,
        option6 : req.body.option6,
        etc_option : req.body.etc_option,
        addition : req.body.addition,
        phone_num : req.body.phone_num,
        img : req.body.img
    });

    console.log(room);
    await room.save();
    req.flash('success', '방 정보를 업로드 하였습니다.~');
    res.redirect('/');
}));

// 방의 세부 정보
router.get('/:id',catchErrors(async (req, res, next) => {
    var room = await Room.findById(req.params.id).populate('user_id');
    var afters = await After.find({room_id : room.id}).populate('user_id');
    res.render("rooms/show",{room : room , afters:afters});
 }));



// 후기 남기기
router.post('/:id/after',needAuth, catchErrors(async (req, res, next) => {
    const user = req.user.id ;
    const room = await Room.findById(req.params.id);

    if(!room){
        req.flash('danger' , '유효한 방정보가 아닙니다~');
        return res.redirect('back');
    }

    user_obj = await User.findById(user);
    var after = new After({
        user_id: user,
        room_id: room.id,
        content:req.body.content
    });
    await after.save(); 
    req.flash('success', '후기를 성공적으로 잘 남겨졌습니다~');
    res.redirect('back');
}));

// 후기 삭제
router.delete('/:id/after', needAuth, catchErrors(async (req, res, next) =>{
    after = await After.findById(req.params.id);
    if(after.user_id == req.user.id){
        await After.findOneAndRemove({_id : req.params.id});    
    }
    req.flash('success', '후기를 삭제 하였습니다~');
    res.redirect('back');
}));

module.exports = router;
