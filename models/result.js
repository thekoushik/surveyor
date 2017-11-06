var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
  survey: { type: Schema.ObjectId, required:true, ref: 'Survey' },
  question: {type:Schema.ObjectId,required: true},
  choices:[ {type:Schema.ObjectId,required: true} ],
  created_at: { type: Date, default: Date.now }
});

module.exports=mongoose.model('Result',resultSchema);