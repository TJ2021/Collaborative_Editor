
var express = require('express');
var router = express.Router();
var passport = require('passport');
const { body, validationResult } = require('express-validator');


/* Get Login page */
router.route('/login')
    .get(function(req, res, next){
        res.render('login', {title: 'Login you account'})
    })    
    .post(function(req, res, next){

    });


/* Get Register page */
router.route('/register')
    .get(function(req, res, next){
        res.render('register', {title: 'Register your account'});
    })
    .post([
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
            var user = new User(); /* create new instance of User model */
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save()
                .then(() =>{
                    res.redirect('/login');
                }) 
                .catch((err) => {
                    console.log(err);
                    res.render('register',{errorMessages:err});
                });
        }

    });

module.exports = router;