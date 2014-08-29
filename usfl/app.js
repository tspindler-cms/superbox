var config = require('./config');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongodb = require('mongodb');
var monk = require('monk');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var dbs = {};

function dbpool(db, coll) {
  if (typeof(dbs[db]) == 'undefined') {
    dbs[db] = {};
  }

  if (typeof(dbs[db][coll]) != 'undefined') {
    console.log("Serving db");
    return dbs[db][coll];
  } else {
    console.log("New db");
    dbs[db][coll] = monk(db).get(coll);
    return dbs[db][coll];
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'images', 'usfl.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.dbhost = config.db;
    req.leagues = config.leagues;
    req.dbpool = dbpool;
    next();
});

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,      Accept");
  next();
};

app.use(allowCrossDomain);
app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
