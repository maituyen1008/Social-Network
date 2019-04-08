var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */

router.get('/register', function(request, response) {
  response.render('users/register');
})

router.get('/login', function(request, response, next) {
  response.render('users/login');
});

router.post('/login', function(request, response) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
  })
})

module.exports = router;
