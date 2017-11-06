var User = require('../../models').user;
const utils = require('../../utils');
const dto=User.DTOProps;

module.exports.userList=function(req, res) {
  const size=(typeof req.query.size == "undefined") ? 10 : Number(req.query.size);
  var query={};
  if(req.query.last) query['_id']={ $gt: utils.createId(req.query.last)};
  User.find(query, dto,{limit:size},function(err, docs) {
    if(err) res.status(500).end();
    else res.status(200).json(docs);
  });
};
module.exports.single=function(req,res){
  User.findById(req.params.id,dto,function(err,doc){
    if(err) res.status(500).end();
    else res.status(200).json(doc);
  });
};
module.exports.userCreate=function(req,res){
  User.find({ username: req.body.username }, 'enabled', function (err, docs) {
    if(err) res.status(500).end();
    else{
      if(docs.length>0) res.status(422).json({
        message: "username exists",
        name: "ValidationError"
      });
      else{
        User.create(req.body,function(err2,small){
          if(err2) res.status(422).json(err2);
          else res.status(201).location(req.baseUrl+req.path+"/"+small._id).end();
        });
      }
    }
  });
};
module.exports.info=function(req, res) {
  res.status(200).json(req.user);
};