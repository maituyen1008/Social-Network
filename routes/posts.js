var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Post = require('../models/Post');

const isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated) {
        return next();
    }
    request.flash('errors', "You need to logged in to do that!");
    response.redirect('/user/login');
}

/* GET home page. */
router.get('/', function(request, response) {
    //Get posts
    response.render('posts/home');
    // User.findById(req.user._id)
    //     .populate("posts") // Get current user post
    //     .exec((error, user) => {
    //         if (error) {
    //             console.log(error);
    //             request.flash('errors', "There has been an error finding all posts.");
    //             response.render("posts/home");
    //         } else {
    //             let posts = [];
    //             for (var i = 0; i < user.posts.length; i++) {
    //                 posts.push(user.posts[i]);
    //             }
    //             if (posts) {
    //                 response.render("posts/home", { posts: posts });
    //             } else {
    //                 response.render("posts/home", { posts: null });
    //             }
    //         }
    //   })
});

module.exports = router;
