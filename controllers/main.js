var app = require('../index');
var Survey = require('../models').survey;
var util = require('util');
var Result = require('../models').result;
var XLSX = require('xlsx');

module.exports.index=function(req,res){
    if(req.isAuthenticated())
        res.render('dashboard',{user:req.user});
    else
        res.render('index');
};
module.exports.my_surveys=function(req,res){
    Survey
        .find({user: req.user._id})
        .sort('-created_at')
        .exec().then((surveys)=>{
            res.render('survey_list',{user:req.user,list:surveys});
        })
};
module.exports.create_survey=(req,res)=>{
    res.render('create_survey',{user:req.user});
};
module.exports.show_survey=(req,res)=>{
    Survey
        .findOne({user: req.user._id,_id: req.params.id})
        .exec().then((servey)=>{
            res.render('show_survey',{user:req.user,servey:servey});
        }).catch((err)=>{
            res.render('500',{err:err});
        })
};
module.exports.embed_survey=(req,res)=>{
    Survey
        .findById(req.params.id)
        .exec().then((servey)=>{
            res.render('embed_survey',{servey:servey});
        }).catch((err)=>{
            res.render('500',{err:err});
        });
};
module.exports.show_question=(req,res)=>{
    Survey
        .findOne({user: req.user._id,_id: req.params.id})
        .exec().then((servey)=>{
            var question=servey.questionnaires.id(req.params.question_id);
            //res.send(util.inspect(question));
            if(question)
                res.render('show_question',{user:req.user,servey_name:servey.name,question:question});
            else
                res.render('500',{err:'question does not exist'});
        })
};
module.exports.show_question_results=(req,res)=>{
    var data={};
    Survey
        .findOne({user: req.user._id,_id: req.params.id})
        .exec().then((servey)=>{
            data.question=servey.questionnaires.id(req.params.question_id);
            if(data.question==null) res.send("No question");
            return Result
                    .mapReduce({
                        map:function(){for(var i=0;i<this.choices.length;i++) emit(this.choices[i],1)},
                        reduce:function(key,values){return values.length},
                        query:{survey:req.params.id,question:req.params.question_id}
                    });
        }).then((result)=>{
            var choices={};
            data.question.choices.forEach((item)=>{
                choices[item._id]={count:0,text:item.text};
            });
            var stat={max:0};
            result.results.forEach((item)=>{
                choices[item._id].count=item.value;
                if(stat.max<item.value) stat.max=item.value;
            });
            res.render('show_result',{user:req.user,question:data.question.question,choices:choices,max:stat.max});
        }).catch((err)=>{
            res.render('500',{err:err});
        })
};
module.exports.export=(req,res)=>{
    Survey
        .find({user: req.user._id})
        .exec().then((surveys)=>{
            var wb=XLSX.utils.book_new();
            surveys.forEach((s)=>{
                var data = s.questionnaires.map((q)=>{
                    var d={question:q.question};
                    q.choices.forEach((c,i)=>{
                        d['choice'+(i+1)]=c.text
                    })
                    return d
                });
                var ws=XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(wb,ws,s.name);
            })
            res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
            res.end(XLSX.write(wb, {type: 'buffer'}));
        }).catch((err)=>{
            res.render('500',{err:err});
        })
};
module.exports.loginPage=function(req,res){
    if(req.isAuthenticated())
        res.redirect('/');
    else
        res.render('login',{
            csrfToken:req.csrfToken(),
            nextUrl: ((req.query.next) ? "?next="+req.query.next: ""),
            loginerror:(req.query.error!=undefined),
            loginerrormsg:req.flash('loginerrormsg')
        });
};
module.exports.registerPage=function(req,res){
    res.render('join',{});
};
module.exports.login=function(req,res,next){
    app.securityManager.authenticateLogin(req,res,next,function(err,user,info){
        if (err) return next(err);
        req.flash('loginerrormsg', (info)?info.message:"");
        if (!user) return res.redirect('/login?error=1'+((req.query.next)?"&next="+req.query.next:""));
        // Manually establish the session...
        req.login(user, function(err) {
            if (err) return next(err);
            if(req.query.next) return res.redirect(req.query.next);
            return res.redirect('/');
        });
    });
};
module.exports.logout=function(req,res){
    req.logout();
    res.redirect('/');
};
module.exports.notFound=function(req,res){
    res.render('404',{origin:req.originalUrl});
};
module.exports.errorHandler=function (err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') res.status(403).send('Hack Attempt!');
  else if(err.code === 'ENEEDROLE') res.render('500',{err:err});
  else return next(err);
};