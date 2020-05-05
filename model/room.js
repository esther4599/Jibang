var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

//방의 정보를 담는 스키마
var schema = new Schema({
  // // 방을 생성한 user의 id
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  //방제목
  title:String,
  //방지역
  locate:String,
  //방종류
  type:String,
  //계약기간
  time:String,
  //평수
  size:String,
  // 보증금
  security_money:String,
  // 월세
  monthly_rent:String,
  // 관리비
  management_expenses:String,
  // 세금 공과금
    // 전기세
  electric:String,
  // 수도세
  water:String,
  // 가스비
  gas:String,
  // 위치
  address:String,
  // 상세 위치
  detail_address:String,
  // 옵션
  option1:String,
  option2:String,
  option3:String,
  option4:String,
  option5:String,
  option6:String,
  // 기타 옵션
  etc_option:String,
  // 부가설명
  addition_ex:String,
  // 전화번호
  phone_num:String,
  // 이미지
  img: [String],
  // 시간
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Room = mongoose.model('Room', schema);

module.exports = Room;
