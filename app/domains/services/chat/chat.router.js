const express = require('express');
const chatRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const chatController = require('./chat.controller');

// chatRouter.post('/new', verifyToken, chatController.create);

module.exports = chatRouter;