var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var passport	= require('passport');
var jwt         = require('jwt-simple');


mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());


require('./config/express')(app, config);
require ('./config/passport')(passport);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

