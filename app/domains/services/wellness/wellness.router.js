const express = require('express');
const wellnessRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const wellnessController = require('./wellness.controller');
const statsRouter = require('./stats/stats.router');

wellnessRouter.post('/new', verifyToken, wellnessController.create);
wellnessRouter.use('/stats', statsRouter);

module.exports = wellnessRouter;