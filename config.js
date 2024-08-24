'use strict'

module.exports = {
     // Configuration for the mailer service
    mailer: {
        service: 'Gmail',
        auth: {
            user: 'tphotos089@gmail.com',
            pass: 'delphy@123'
        }
    },
    // MongoDB connection string for connecting to the database
    dbConnstring: 'mongodb://127.0.0.1:27017/codeshare',
    // Secret key used for session management
    sessionKey: 'HaloCode4Share'
}
