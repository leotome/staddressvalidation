module.exports = app => {
    const controller = require('../controllers/controller.js');
    var router = require('express').Router();

    router.get('/:country/:postalcode', controller.search);

    app.use('/api', router);
}