/* passprt is an authentication module . The Strategy constructor is used to 
create instances of authentication strategies, specifically for authenticating
 with a username and password stored locally. */
var passport = require('passport');
const user = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

/*
input: user -> The user object that needs to be serialized.
       done -> A callback function to be called once serialization is complete. 
               It follows the convention (error, serializedUser)
Description: A fn used to serialize user objects into the session
*/
passport.serializeUser(function(user, done) {
    done(null, user._id);
});


/*
input: id -> Unique identifier stored in the session.
       done -> A callback function to be called once deserialization is complete. 
               It follows the convention (error, user)
Description: A function used to deserialize a user object from the 
            session store using the unique identifier.
*/
passport.deserializeUser(function(id, done){
    User.findOne({_id: id}, function(err, user){
        done(err, user);
    });
});


/*
Configure local authentication startegy.
Error if username(email) is not in database.
Error in case of password mismatch
*/
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done){
    User.findOne({email: username}, function(err, done){
        if (err) return done(err);
        if (!user){
            return done(null, false, {
                message: 'Incorrect username or password'
            });
        }
        if(!user.validPassword(password)){
            return(null, false, {
                message: 'Incorrect username or password'
            });
        }
        return done(null, user);
    })
  }
));