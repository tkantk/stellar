'use strict';

module.exports = function(Projectconfiguration) {

    Projectconfiguration.createProject = function(req, res){
      req.id = req.projectName+req.accountName
      console.log(req)
      Projectconfiguration.create(req)
      res = "Created Jingalala jingala hoo haah"
      return res;
    }
    Projectconfiguration.get = function(projId){
      Projectconfiguration.find({where: {id: projId}, limit: 3})
    }
    Projectconfiguration.remoteMethod('createProject', {
        accepts: [
          {arg: 'project-configuration', type: 'object', http: {source: 'body'}},
        ],
        http: {
          path: '/createProject',
          verb: 'POST',
        },
        returns: {
          arg: 'message',
          type: 'string',
        }
      });

    Projectconfiguration.remoteMethod('get', {
        accepts: [
          {arg: 'id', type: "String", http: {source: 'body'}},
        ],
        http: {
          path: '/get',
          verb: 'GET',
        },
        returns: {
          arg: 'project-configuration',
          type: 'object',
        }
      });
};
