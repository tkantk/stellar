'use strict';

var csv = require('fast-csv');

module.exports = function (Metrics) {

  var authors = []
  var processExcel = (csvFile) => {
    //console.log(csvFile)
    csv.fromString(csvFile[0].buffer.toString(),{
      headers : true,
      ignoreEmpty : true
    }).on("data", function(data){
      authors.push(data);
    }).on("end", function(){
      Metrics.replaceOrCreate(authors)
      //console.log("Insertion Complete :: "+authors.length+ " rows" )
    })
    return "Insertion Complete :: "+authors.length+ " rows"
  }


  Metrics.uploadExcel = function (req, cb) {
    var multer = require('multer')
    var storage = multer.memoryStorage()
    var fileupload = multer({
      storage: storage
    })

    var upload = fileupload.array('file', 1);
    var status;
    upload(req, cb, function (err) {
      if (err) {
        cb(null, "Error occured while uploading.");
      }
      //Process the excel
      var csvFile = req.files;
      status = processExcel(csvFile);
      cb(null, status);
    })    
  };


  Metrics.getMetricsData = function (ctx, userId, cb) {
    console.log("get method of metrics data is called");
    var userIdValue = ctx.req.accessToken.userId;
    
    console.log(`userid from request is ${userIdValue}`);
    
    //find user role
    Metrics.app.models.ApplicationUser.find(
      {where:{id:`${userIdValue}`},},
      function(err, user) {
     ctx.req.userRole = user[0].role;
     console.log(user[0].role);
     if (ctx.req.userRole!='admin'){

    //Find all projects where user has access to  
    Metrics.app.models.ProjectConfiguration.find(
      {where:{userId:`${userIdValue}`},},
         function(err, projectConfig) {
          console.log(projectConfig);
        ctx.req.projectConfig = projectConfig[0].projectName;
        console.log(projectConfig[0]);
        var projectNames = [];
        projectConfig.forEach(function(project){
          console.log(project.projectName);
          projectNames.push(project.projectName);
        });
        
        console.log(projectNames);
        
      //find all metrics for projects where user has access to
      Metrics.find( {where:{"Project":{in: projectNames}}},
      function(err, metricsData) {
          console.log(metricsData);
        cb(null, metricsData);        
      });
    });      
     }
     else
     {
       console.log('User have admin role');
      //return all metrics data
       Metrics.find( {},
       function(err, metricsData) {
           console.log(metricsData); 
         cb(null, metricsData);         
       });       
     }
      });


  };

  Metrics.beforeRemote('getMetricsData', function(ctx, userId, next) {
       console.log(`accesstoken from request ${ctx.req.accessToken.user}`);
       next();
  })

  Metrics.remoteMethod('uploadExcel', {
    accepts: [{
      arg: 'req',
      type: 'any',
      http: {
        source: 'req'
      }
    }, ],
    http: {
      path: '/uploadExcel',
      verb: 'post',
    },
    returns: {
      arg: 'message',
      type: 'string',
    }
  })

  Metrics.remoteMethod('getMetricsData', {
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
      {arg: 'userId', type: 'number'},
    ],
    http: {
      path: '/getMetricsData',
      verb: 'get',
    },
    returns: {
      arg: 'Metrics',
      type: 'array',
    },
  });
}