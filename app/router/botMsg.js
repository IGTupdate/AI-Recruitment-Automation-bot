const { botMsgs } = require('../controller');

var router = require('express').Router();


module.exports = app => {
    router.post('/botmsg', botMsgs.botMsg)


    app.use('/api', router)
}