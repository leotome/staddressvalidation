module.exports = app => {
    const data_controller = require('../controllers/data.js');
    var router = require('express').Router();

    router.get('/:country/:postalcode', data_controller.search);

    app.use('/api', router);
}