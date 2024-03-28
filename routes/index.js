var express = require('express');
const { body, validationResult } = require('express-validator');

var nodemailer = require('nodemailer');
var config = require('../config');
//  to create a transporter object by passing configuration options. 
// The configuration options depend on the type of email delivery service you want to use.
// For example, if you're using SMTP to send emails through a mail server, you need to provide SMTP server settings.
//var transporter = nodemailer.createTransport(config.mailer);

// express.Router() function is used to create a new router object. 
// This function is used when you want to create a new router object in your program to handle requests. 
var router = express.Router();
router.use(express.json());


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Code4Share - A platform for sharing code' });
});

/* Get about page */
router.get('/about', function(req, res, next){
  res.render('about', {title:'About Page'});
});

/* Get contact page */

/* The router.route() method in Express.js - to create chainable route handlers for a 
specific route path. It allows to define multiple HTTP methods (e.g., GET, POST, PUT, DELETE) 
for the same route path in a single statement, making code more concise and organized. */

/* router.route() creates a route handler for the '/contact' path  */
/* No semicolon between route handlers */
router.route('/contact')

  .get(function(req, res, next){
    res.render('contact');
  })

  .post([
    body('name').notEmpty().withMessage('Empty Name'),
    body('email').isEmail().withMessage('Invalid email'),
    body('message').notEmpty().withMessage('Empty Message')
  ],(req, res)=>{
    var result = validationResult(req);
    var errors = result.array();
    if (errors.length > 0){
      res.render('contact',{
        title: 'Code4Share - a platform for sharing the code',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    }else{
      res.render('thankyou');
      var mailOptions = {
        from: 'Code4Share <no-reply@code4share.com>',
        to: 'tphotos089@gmail.com',
        subject: 'You got a new message from a visitor',
        text: req.body.message
      };
     // transporter.sendMail(mailOptions,function(error,info){
      //  if (error){
       //   return console.log(error);
     //   }else{
      //    res.render('thankyou');
      //  }
     // });
      
    }
  });

module.exports = router;
