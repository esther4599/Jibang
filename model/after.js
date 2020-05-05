var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema; 

// 후기 좋아요
var schema = new Schema({
  // 사용자의 데이터 id
  user_id: {type: Schema.Types.ObjectId, ref: 'User' },
  // 방정보의 데이터 id
  room_id: {type: Schema.Types.ObjectId, ref: 'Room'}, 
  // 후기
  content: {type: String},
  // 생성한 시간
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var After = mongoose.model('After', schema);

module.exports = After;