const { auths } = require('../controller');

var router = require('express').Router();

module.exports = app => {
    router.post('/login', auths.login)

    router.get('/me', auths.me)

    // router.get('/logout', auths.logout)

    router.post('/forgotPassword', auths.forgotPassword)

    // router.post('/forgotPasswordVerify', auths.forgotPasswordVerify)



    app.use('/api', router);
}