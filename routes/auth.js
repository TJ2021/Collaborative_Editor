
var express = require('express');
var router = express.Router();
var passport = require('passport');
const { body, validationResult } = require('express-validator');


/* Route for handling the login page */
router.route('/login')
    .get(function(req, res, next){
        res.render('login', {title: 'Login you account'})   // Render the login page with the title
    })    
    .post(function(req, res, next){

    });


/* Route for handling the registration page */
router.route('/register')
    .get(function(req, res, next){
        res.render('register', {title: 'Register your account'});
    })
    .post([
        // Validation chain to check input fields
        body('name').notEmpty().withMessage('Empty Name'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Empty Password'),
        body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
        body('password').custom((value, {req})=>{
            if (value != req.body.confirmPassword){
                //throw new Error('Password does not match');
            }
            return true;
        })
      ], (req, res) => {
        var result = validationResult(req);
        var errors = result.array();
        if (errors.length > 0){
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            });
        }else{
            // If validation passes, create a new instance of the User model
            var user = new User(); /* create new instance of User model */
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            // Save the user to the database
            user.save()
                .then(() =>{
                    // On successful save, redirect the user to the login page
                    res.redirect('/login');
                }) 
                // If there's an error saving the user, log the error and re-render the register page with the error message
                .catch((err) => {
                    console.log(err);
                    res.render('register',{errorMessages:err});
                });
        }

    });
* Export the router to be used in the main application file */
module.exports = router;
