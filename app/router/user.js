var router = require('express').Router();
const { users } = require('../controller');


module.exports = app => {
    router.post('/register', users.register)

    router.get('/users', users.findAll)

    app.use('/api', router)
}