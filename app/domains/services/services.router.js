const express = require('express');
const serviceRouter = express.Router();

const chatRouter = require('./chat/chat.router');
const tripRouter = require('./trip/trip.router');

serviceRouter.use('/chat', chatRouter);
serviceRouter.use('/trip', tripRouter);

module.exports = serviceRouter;