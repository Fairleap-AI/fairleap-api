const express = require('express');
const predictRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const predictController = require('./predict.controller');

predictRouter.post('/earnings', verifyToken, predictController.earnings);

module.exports = predictRouter;