var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');

/* GET users listing. */

//Get register get route
router.get('/user/register', function(request, response) {
    response.render('users/register');
})

//Get register post route
router.post('/user/register', function(request, response) {
    if (request.body.email 
        && request.body.firstname
        && request.body.lastname
        && request.body.password 
    ) {
        var newUser = new User ({
            username : request.body.email,
            firstName : request.body.firstname,
            lastName : request.body.lastname,
        })
        createUser (newUser, request.body.password, request, response);
    }
})

function createUser(newUser, password, request, response) {
    User.register(newUser, password, (error, user) => {
        if (error) {
            request.flash('errors', error.message);
            response.redirect("/user/register");
        }
        else {
            passport.authenticate("local")(request, response , function() {
                request.flash('success', "Success! You are registered and logged in!")
                response.redirect("/user/login");
            })
        }
    })
}

router.get('/user/login', function(request, response, next) {
    response.render('users/login');
});

router.post('/user/login', passport.authenticate('local', {
        successRedirect: '/user/register',
        failureRedirect: '/user/login',
    }),
    (request, response) => {}
)

module.exports = router;
