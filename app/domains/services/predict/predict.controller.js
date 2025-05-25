const { daily } = require('../trip/stats/stats.controller');

const Service = require('../services.model').Service;

const earnings = async (req, res) => {
    try {
        const { start, end, wellness_score } = req.body;

        if (!start || !end || !wellness_score) {
            let invalidItems = [];
            if (!start) invalidItems.push('"start"');
            if (!end) invalidItems.push('"end"');
            if (!wellness_score) invalidItems.push('"wellness_score"');
            return res.status(400).json({
                status: 'error',
                message: `Parameter ${invalidItems.join(", ")} required`,
                data: {}
            });
        }

        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        const requestBody = {
            start,
            end,
            wellness_score,
            daily_logs: getService.trip_stats.daily.map(({ _id, date, total_distance, total_fare, total_tip, total_earnings, total_trips }) => ({day: date, total_distance, total_fare, total_tip, total_earnings, total_trips})).slice(-50)
        };

        const response = await fetch(process.env.FAIRLEAP_AI_HOST + "/predict/earnings", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(errorData);
            return res.status(400).json({
                status: 'error',
                message: process.env.DEBUG ? errorData.error.message : "Failed to process request",
                data: errorData.error
            });
        }

        let data = await response.json();

        res.status(200).json({
            status: "success",
            message: "Successfuly predict earnings",
            data: data
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
    earnings
}