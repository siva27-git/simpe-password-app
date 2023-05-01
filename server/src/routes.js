const { Router } = require('express');

const controller = require('./controller');

const apiRouter = Router();

module.exports = apiRouter
    .post('/processPassword', controller.processPassword);
