module.exports = app => {
    var router = require('express').Router();

    const data_controller = require('../controllers/data.js');

    router.get('/search/:country/:postalcode', data_controller.search);

    const auth_controller = require('../controllers/auth.js');

    router.post('/auth/register', auth_controller.registerUser);
    router.post('/auth/login', auth_controller.loginUser);
    router.post('/auth/token', auth_controller.verifyToken);

    app.use('/api', router);
}