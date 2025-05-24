const express = require('express');
const llmRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const llmController = require('./llm.controller');

llmRouter.post('/fin_tips', verifyToken, llmController.fin_tips);
llmRouter.post('/wellness', verifyToken, llmController.wellness);
llmRouter.post('/invest', verifyToken, llmController.invest);

module.exports = llmRouter;