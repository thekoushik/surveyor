var Result = require('../../models').result;

module.exports.createResult=(req,res)=>{
    var result = new Result();
    for(var key in req.body)
        result[key]=req.body[key]
    result.survey=req.params.survey_id
    result.question=req.params.question_id
    result.save().then((newresult)=>{
        res.status(201).end();
    }).catch((err)=>{
        res.status(500).send(err);
    })
};
