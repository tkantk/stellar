'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

var fileUpload = require('express-fileupload');
app.use(fileUpload());
app.post('/upload', function(req, res) {
  
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
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
