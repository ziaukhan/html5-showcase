
/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');
//var mongoStore = require('connect-mongo')(express);
//var passport = require('passport');
//var mongoose = require('mongoose');


var app = express();

//mongo uri
/**
app.set('mongodb-uri', process.env.MONGOLAB_URI || 'localhost/sampledb');

//setup mongoose
app.db = mongoose.createConnection(app.get('mongodb-uri'));
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
    console.log('mongoose open for business');
});

require('./models')(app, mongoose);
*/
// all environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(function(req, res, next) {
    if(req.url.match(/^\/test\//) != null) {
        res.sendfile(path.join(__dirname, req.url));
    } else {
        next();
    }
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.engine('html', require('ejs').renderFile);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
require('./routes')(app, null);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
