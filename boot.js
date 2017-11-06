var app = require('./index');
//setup
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var helmet = require('helmet');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var csrf = require('csurf');
var csrfProtection=module.exports.csrfProtection = csrf({ cookie: true });

app.use(cookieParser());
app.use(expressSession({
    secret:process.env.SESSION_SECRET || "verysecret",
    resave: true,
    saveUninitialized: true 
}));

app.use(require('connect-flash')());
//end setup
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models').user;
const dto = User.DTOPropsFull;

passport.use(new passportLocal.Strategy(function(username,password,doneCallback){
    //access db and fetch user by username and password
    /*
    doneCallback(null,user)//success
    doneCallback(null,null)//bad or username missing
    doneCallback(new Error("Internal Error!"))//internal error
    */
    User.find({username: username,password:password},dto,function(err,docs){
        if(err) doneCallback(new Error("Internal Error!"));
        else if(docs.length==0) doneCallback(null,false,{message:'Wrong credential'});
        else{
            var user=docs[0];
            if(!user.enabled)
                doneCallback(null,false,{message:'Account is not activated'});
            else if(!user.accountNonLocked)
                doneCallback(null,false,{message:'Account is locked'});
            else if(!user.accountNonExpired)
                doneCallback(null,false,{message:'Account has expired'});
            else if(!user.credentialsNonExpired)
                doneCallback(null,false,{message:'Your credential has expired'});
            else
                doneCallback(null,user);
        }
    });
    /*if(username === password){
        doneCallback(null,{id:username,name:username});
    }else{
        doneCallback(null,false,{message:'wrong'});
    }*/
}));
passport.serializeUser(function(user,doneCallback){
    doneCallback(null, user._id);
});
passport.deserializeUser(function(id, doneCallback) {
  User.findById(id,dto, function(err, user) {
    if(err) doneCallback(new Error("Internal Error!"));
    else doneCallback(null,user);
  });
});

module.exports.authenticateLogin=function(req,res,next,cb){
    passport.authenticate('local',cb)(req,res,next);
};
