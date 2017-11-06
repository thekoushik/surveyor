var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var questionSchema = require('./question').schema;

var surveySchema = new Schema({
  name:  {type:String,required: true},
  user: {
      type: Schema.ObjectId,
      required:true,
      ref: 'User'
  },
  questionnaires:[ questionSchema ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports=mongoose.model('Survey',surveySchema);