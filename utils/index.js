var mongoose = require('mongoose');
module.exports.createId=function(str){
    return new mongoose.Types.ObjectId(str);
}