const express = require('express');
const tripRouter = express.Router();

const verifyToken = require('../../../middlewares/auth/jwt/jwt.verify');

const tripController = require('./trip.controller');
const statsRouter = require('./stats/stats.router');

tripRouter.post('/new', verifyToken, tripController.create);
tripRouter.use('/stats', statsRouter);

module.exports = tripRouter;