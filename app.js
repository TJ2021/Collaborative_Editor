var createError = require('http-errors'); // Import the http-errors module for creating HTTP error objects
var express = require('express'); // Import the Express framework
var path = require('path'); // Import the path module for working with file and directory paths
var cookieParser = require('cookie-parser'); // Import the cookie-parser middleware for handling cookies
var logger = require('morgan'); // Import the morgan logger middleware for logging HTTP requests
var mongoose = require('mongoose');  // Import Mongoose for MongoDB object modeling
var passport = require('passport');  // Import Passport for authentication
var session = require('express-session'); // Import express-session for session management
var config = require('./config'); // Import the configuration file
require('./passport'); // Import Passport configuration and strategies

var indexRoute = require('./routes/index'); // Import the index routes
var authRoute = require('./routes/auth'); // Import the authentication routes

// Connect to MongoDB using Mongoose
mongoose.connect(config.dbConnstring).then(
  () => { 
     console.log("Connected to DB!");  // Log successful connection to the database
 },
  (err) => { 
    console.log(err); // Log any connection errors
 }
);
global.User = require('./models/user');  // Make the User model globally accessible


var app = express(); // Create an Express application

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Setup session management
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true}
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the imported routes for handling requests
app.use('/', indexRoute);
app.use('/', authRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
