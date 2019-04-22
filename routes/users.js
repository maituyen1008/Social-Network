var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var multer = require("multer");
var cloudinary = require("cloudinary");

/* GET users listing. */

// Multer setup
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return callback(new Error("Only image files are allowed!"), false);
    }
    callback(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

// Cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    }
    request.flash('errors', "You need to logged in to do that!");
    response.redirect('/user/login');
}

//Get register get route
router.get('/user/login', function(request, response) {
    response.render('users/login');
})

//Get register post route
router.post('/user/register', upload.single("image"), function(request, response) {
    if ( request.body.username
        && request.body.firstName
        && request.body.lastName 
        && request.body.password
    ) {
        var newUser = new User ({
            username : request.body.username,
            firstName : request.body.firstname,
            lastName : request.body.lastname,
        })
        if (request.file) {
            cloudinary.uploader.upload(request.file.path, result => {
                newUser.profile = result.secure_url;
                return createUser(newUser, request.body.password, request, response);
            });
        } else {
            newUser.profile = process.env.DEFAULT_PROFILE_PIC;
            return createUser(newUser, request.body.password, request, response);
        }    
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
        successRedirect: '/',
        failureRedirect: '/user/login',
    }),
    (request, response) => {}
)

module.exports = router;
