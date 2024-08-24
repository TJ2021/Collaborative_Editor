var mongoose = require('mongoose');
/* Import the 'crypto' library for cryptographic functions */
var crypto = require('crypto');

/* Define the schema for a 'User' document in MongoDB */
var userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,    // Ensure each email is unique in the database
        required: true   // Email is a required field
    },
    name:{
        type: String,
        required: true   // Name is a required field
    },
    hash: String,       // Store the hashed password
    salt: String        // Store the salt used for hashing the passwordn
});

/* add instance methods to mongoose models . 
It is available for individual user documents */


/*
input: password (string)
output: none
description: Generates a salt and hash for the password 
             using the PBKDF2 algorithm and stores them in the user document.
*/
userSchema.methods.setPassword = function(password){
    // Generate a random salt of 16 bytes and convert it to a hexadecimal string
    this.salt = crypto.randomBytes(16).toString('hex'); 
    // Generate a hash of the password using PBKDF2 with the generated salt, 
    // 1000 iterations, a key length of 64 bytes, and the 'sha1' hash function. 
    // Then, convert the hash to a hexadecimal string.
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};


/*
input: password (string)
output: Boolean (true/false)
description: Validates the password by generating a hash with the stored salt
             and comparing it to the stored hash. Returns true if the hashes match.
*/
userSchema.methods.validPassword = function(password){
    // Generate a hash using the provided password and the stored salt
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    // Compare the generated hash with the stored hash and return true if they match
    return this.hash == hash
};

/* Export the 'User' model based on the 'userSchema' */
module.exports = mongoose.model('User', userSchema);
