const express = require('express');
const serviceRouter = express.Router();

const chatRouter = require('./chat/chat.router');
const tripRouter = require('./trip/trip.router');
const wellnessRouter = require('./wellness/wellness.router');

serviceRouter.use('/chat', chatRouter);
serviceRouter.use('/trip', tripRouter);
serviceRouter.use('/wellness', wellnessRouter);

module.exports = serviceRouter;