var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require("mongoose");
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local');
var bodyparser = require('body-parser');
var User = require('./models/User');  
var flash = require('connect-flash');

var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    expressSession({
        secret: "secretKey",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 },
    })
);

//Set up passport for authen
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

var url = "mongodb://localhost:27017/social_network";

mongoose.connect(url, (error) => {
    if (error) throw error;
    console.log('Connect success!')
});

app.use((request, response, next) => {
    response.locals.user = request.user;
    response.locals.login = request.isAuthenticated();
    response.locals.errors = request.flash("errors");
    response.locals.success = request.flash("success");
    next();
});

app.use('/', postsRouter);
app.use('/', usersRouter);

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
