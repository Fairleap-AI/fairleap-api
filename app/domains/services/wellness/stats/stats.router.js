const express = require('express');
const tripRouter = express.Router();

const verifyToken = require('../../../../middlewares/auth/jwt/jwt.verify');

const statsController = require('./stats.controller');

tripRouter.get('/daily', verifyToken, statsController.daily);
tripRouter.get('/monthly', verifyToken, statsController.monthly);
tripRouter.get('/yearly', verifyToken, statsController.yearly);

module.exports = tripRouter;