var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
const mongoosePaginate = require('mongoose-paginate');

// user의 id를 담는 스키마
var schema = new Schema({
  // user의 id
  // 사용자의 실재 id데이터
  facebook_id: {type: String, required: true, trim: true},
  name: {type: String, required: true, trim: true},
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
schema.plugin(findOrCreate);
var User = mongoose.model('User',schema);

module.exports = User;
