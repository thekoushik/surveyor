var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  {type:String,required: true},
  email: {type:String,required: true},
  username: {type:String,required: true},
  password: {type:String,required: true},
  enabled: { type: Boolean, default: true },
  accountNonLocked: { type: Boolean, default: true },
  accountNonExpired: { type: Boolean, default: true },
  credentialsNonExpired: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports=mongoose.model('user',userSchema);
module.exports.DTOProps='_id name email username created_at';
module.exports.DTOPropsFull='_id name email username enabled accountNonLocked accountNonExpired credentialsNonExpired created_at updated_at';