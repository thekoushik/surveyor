var mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/surveyor';
mongoose.Promise=global.Promise;
mongoose.connect(mongoDB,{ useNewUrlParser: true});

module.exports.user=require('./user');
module.exports.survey=require('./survey');
module.exports.question=require('./question');
module.exports.result=require('./result');