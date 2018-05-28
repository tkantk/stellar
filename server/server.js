'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var multer  = require('multer')

var app = module.exports = loopback();
const port = process.env.PORT || 5000;

app.start = function() {
  // start the web server
  return app.listen(port,function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.use(function(req, res, next) {
  app.currentUser = null;
  if (!req.accessToken) return next();
  req.accessToken.user(function(err, user) {
    if (err) return next(err);
    req.currentUser = user;
    next();
  });
});

var upload = require('./upload.js');
var storage = multer.memoryStorage()
var fileupload = multer({ storage: storage })
app.post('/csvUploadForm',fileupload.single('file') , upload.post);

