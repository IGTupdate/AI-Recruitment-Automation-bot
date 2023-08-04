const { ratings } = require('../controller');

var router = require('express').Router();


module.exports = app => {
    router.post('/ratings', ratings.create)

    router.get('/ratings', ratings.findAll)

    app.use('/api', router)
}