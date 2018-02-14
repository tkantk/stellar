'use strict';

module.exports = function(Metrics) {
   
     // module.exports = function(app, cb) {
       // const promises = [];
       //const modelName = require('metrics');
        //const Model = loopback.findModel('metrics');
        //const modelItems = mongoData[modelName];
        //const m = require('../common/models/metrics.json');
        //app.model(metrics', {dataSource: 'db'});
        //console.log(m); 
        //const Model = app.models[m];
       // console.log(Model); 
       //var app = module.exports = loopback();
        //var models = app.model.metrics;
        
        //models.forEach(function(Model) {
         //console.log(models); // color


    Metrics.uploadExcel = function(ctx, cb) {

      const mapper = require('../../common/models/mapper.json');
        var mongoXlsx = require('mongo-xlsx');
      console.log("hello im the upload excel function");
      //var loopback = require('loopback');
        mongoXlsx.xlsx2MongoData("./test2.csv", mapper, function(err, mongoData) {
          console.log('Mongo data:', mongoData);
          mongoData.forEach(element => {
            Metrics.upsert(element, null);
          });
          
         cb(null, "inserted into DB");
    });
}

Metrics.upload = function(ctx, cb) {
  
var fileUpload = require('express-fileupload');
//Metrics.use(fileUpload());
Metrics.post('/upload', function(req, res) {
  
  if (!req.files.file) {
   res.send("No files were uploaded.");
   return;
   }
  
  var sampleFile;
    
  sampleFile = req.files.file;
  
  sampleFile.mv('./uploads/'+req.files.file.name, function(err) {
   if (err) {
   console.log("eror saving");
   }
   else {
   console.log("saved");
   if(req.files.file.name.split('.')[req.files.file.name.split('.').length-1] === 'xlsx'){
    console.log("excel file found");
  }
  }
});
});
};

    Metrics.remoteMethod('uploadExcel', {
        accepts: [
          {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        http: {
          path: '/uploadExcel',
          verb: 'get',
        },
        returns: {
          arg: 'message',
          type: 'string',
        }
      });

      Metrics.remoteMethod('upload', {
        accepts: [
          {arg: 'ctx', type: 'object', http: {source: 'context'}},
        ],
        http: {
          path: '/upload',
          verb: 'post',
        },
        returns: {
          arg: 'message',
          type: 'string',
        }
      });
};
