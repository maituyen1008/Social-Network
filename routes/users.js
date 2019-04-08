var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */

router.get('/user/register', function(request, response) {
  response.render('users/register');
})

router.post('/user/register', function(request, response) {
  console.log(request.body);
})

router.get('/user/login', function(request, response, next) {
  response.render('users/login');
});

router.post('/user/login', function(request, response) {
  console.log(request.body)
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
  })
})

module.exports = router;
