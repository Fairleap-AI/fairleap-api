const express = require('express');
const chatRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const chatController = require('./chat.controller');

chatRouter.post('/create', verifyToken, chatController.create);
chatRouter.get('/list', verifyToken, chatController.list);
chatRouter.get('/read/:id', verifyToken, chatController.read);
chatRouter.put('/reply', verifyToken, chatController.reply);

module.exports = chatRouter;