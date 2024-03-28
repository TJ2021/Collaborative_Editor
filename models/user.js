var mongoose = require('mongoose');
/* library to encrypt data */
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

/* add instance methods to mongoose models . 
It is available for individual user documents */

/*
input: password
output: salt and hash
description: Generates a salt and hash for the password 
            using the PBKDF2 algorithm.
*/
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex'); /* convert to hexadecimal string */
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');  /* 'sha1' is the hash function */
};

/*
input: password
output: Boolean
description: Validate password
*/
userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return this.hash == hash
};

module.exports = mongoose.model('User', userSchema);