var express = require('express');
var app = module.exports = express();

app.use('/static',express.static('static'));
app.set('view engine','html');
app.engine('html',require('ejs').renderFile);

var securityManager = module.exports.securityManager = require('./boot');

require('./routes');

var port=process.env.PORT || 8000;
app.listen(port,function(){
    console.log("Listening on 'http://127.0.0.1:"+port);
});
