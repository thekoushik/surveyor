var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    question: {type:String,required: true},
    multi: {type:Boolean,default:true},
    imageUrl: String,
    choices: [
        {
            text: {type:String,required: true},
            imageUrl: String
        }
    ]
});
module.exports=mongoose.model('Question',questionSchema);
module.exports.schema=questionSchema;