const Service = require('../../services.model').Service;

const daily = async (req, res) => {
    try {
        const getService = await Service.findOne( { email: req.user.email }, { 'trip_stats.daily': 1, _id: 0 } );
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfuly read user daily stats",
            data: getService.trip_stats.daily.map(({ date, total_distance, total_fare, total_tip, total_earnings, total_trips }) => ({ date, total_distance, total_fare, total_tip, total_earnings, total_trips }))
        });
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
};

const monthly = async (req, res) => {
    try {
        const getService = await Service.findOne( { email: req.user.email }, { 'trip_stats.monthly': 1, _id: 0 } );
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfuly read user monthly stats",
            data: getService.trip_stats.monthly.map(({ month, total_distance, total_fare, total_tip, total_earnings, total_trips }) => ({ month, total_distance, total_fare, total_tip, total_earnings, total_trips }))
        });
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
};

const yearly = async (req, res) => {
    try {
        const getService = await Service.findOne( { email: req.user.email }, { 'trip_stats.yearly': 1, _id: 0 } );
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfuly read user yearly stats",
            data: getService.trip_stats.yearly.map(({ year, total_distance, total_fare, total_tip, total_earnings, total_trips }) => ({ year, total_distance, total_fare, total_tip, total_earnings, total_trips }))
        });
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            status: 'error',
            message: process.env.DEBUG ? err.message : "Bad Request",
            data: {}
        });
    }
};

module.exports = {
    daily,
    monthly,
    yearly
};