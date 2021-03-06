var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var path = require('path');
var cors = require('cors')
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var User = require('./api/models/userModel'); // create model User loading here
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/server_blog_db');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))


  app.get('/hihi', function (req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1
  
    // Write response
    res.end(req.session.views + ' views')
  })
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

var routerUser = require('./api/routers/userRoter');
routerUser(app);

app.listen(port, ()=> console.log("Server running on port " + port));