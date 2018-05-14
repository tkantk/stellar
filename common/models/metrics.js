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
  });
};
