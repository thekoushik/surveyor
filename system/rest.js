const utils = require('../utils');

module.exports.createREST=function(model,dto,options){
    var opt=Object.assign({
        list_size_default:10,
        pre_create:function(req,cb){
            cb(null,req.body);
        },singleDTO:dto
    },options);
    return {
        list:function(req,res){
            const size=(typeof req.query.size == "undefined") ? opt.list_size_default : Number(req.query.size);
            var query={};
            if(req.query.last) query['_id']={ $gt: utils.createId(req.query.last)};
            model.find(query, dto,{limit:size},function(err, docs) {
                if(err) res.status(500).end();
                else res.status(200).json(docs);
            });
        },
        single:function(req,res){
            model.findById(req.params.id,opt.singleDTO,function(err,doc){
                if(err) res.status(500).end();
                else res.status(200).json(doc);
            });
        },
        create:function(req,res){
            opt.pre_create(req,function(err,body){
                if(err) res.status(422).json(err);
                else
                model.create(body,function(err2,small){
                    if(err2) res.status(422).json(err2);
                    else res.status(201).location(req.baseUrl+req.path+"/"+small._id).end();
                });
            });
        }
    };
}