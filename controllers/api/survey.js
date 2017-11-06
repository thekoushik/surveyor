var Survey = require('../../models').survey;

module.exports.listOfUser=(req,res)=>{
    Survey
        .find({user: req.user._id})
        .sort('-created_at')
        .exec().then((surveys)=>{
            res.json(surveys);
        }).catch((err)=>{
            res.status(500).send(err);
        });
}

module.exports.createOfUser=(req,res)=>{
    var survey=new Survey();
    for(var key in req.body)
        survey[key]=req.body[key]
    if(req.user)
        survey.user=req.user._id
    survey.save().then((newsurvey)=>{
        res.status(201).end();
    }).catch((err)=>{
        res.status(500).send(err);
    })
}