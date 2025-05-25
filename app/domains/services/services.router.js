const express = require('express');
const serviceRouter = express.Router();

const chatRouter = require('./chat/chat.router');
const tripRouter = require('./trip/trip.router');
const wellnessRouter = require('./wellness/wellness.router');
const llmRouter = require('./llm/llm.router');
const predictRouter = require('./predict/predict.router');

serviceRouter.use('/chat', chatRouter);
serviceRouter.use('/trip', tripRouter);
serviceRouter.use('/wellness', wellnessRouter);
serviceRouter.use('/llm', llmRouter);
serviceRouter.use('/predict', predictRouter);

module.exports = serviceRouter;