const Service = require('../services.model').Service;

const create = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            let invalidItems = [];
            if (!query) invalidItems.push('"query"');
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
            query
        };

        const response = await fetch(process.env.FAIRLEAP_AI_HOST + "/llm/chatbot", {
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

        getService.chatSession.push({chatData: data.messages});

        await getService.save();

        res.status(200).json({
            status: "success",
            message: "Successfuly create new chat",
            data: {
                response: data.response
            }
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

const list = async (req, res) => {
    try {
        const getService = await Service.findOne({ email: req.user.email });
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or not registered yet",
                data: {}
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfuly list chat data",
            data: getService.chatSession.map((z) => ({
                    id: z._id,
                    highlight: z.chatData[1]?.content
            }))
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

const read = async (req, res) => {
    try {
        const { id  } = req.params;

        if (!id) {
            let invalidItems = [];
            if (!distance) invalidItems.push('"id"');
            return res.status(400).json({
                status: 'error',
                message: `Parameter ${invalidItems.join(", ")} required`,
                data: {}
            });
        }

        const getService = await Service.findOne(
            { email: req.user.email, "chatSession._id": id },
            { "chatSession.$": 1 }
        );
        if (!getService) {
            return res.status(400).json({
                status: 'error',
                message: "User not found or Invalid chat id",
                data: {}
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfuly read chat data",
            data: getService.chatSession[0].chatData
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

const reply = async (req, res) => {
    try {
        const { query, fare, tip, duration, time_start, time_end } = req.body;

        if (!distance || !fare || !tip || !duration || !time_start || !time_end) {
            let invalidItems = [];
            if (!distance) invalidItems.push('"distance"');
            if (!fare) invalidItems.push('"fare"');
            if (!tip) invalidItems.push('"tip"');
            if (!duration) invalidItems.push('"duration"');
            if (!time_start) invalidItems.push('"time_start"');
            if (!time_end) invalidItems.push('"time_end"');
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

        getService.trip_logs.push({
            distance,
            fare,
            tip,
            duration,
            time_start,
            time_end
        })

        const d = new Date(time_start);
        const year = d.getFullYear().toString();
        const month = `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}`;
        const date = `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;

        const yearlyEntry = getService.trip_stats.yearly.find(e => e.year === year);
        if (yearlyEntry) {
            yearlyEntry.total_distance += distance;
            yearlyEntry.total_fare += fare;
            yearlyEntry.total_tip += tip;
            yearlyEntry.total_earnings += fare + tip;
            yearlyEntry.total_trips += 1;
        } else {
            getService.trip_stats.yearly.push({
                year,
                total_distance: distance,
                total_fare: fare,
                total_tip: tip,
                total_earnings: fare + tip,
                total_trips: 1
            });
        }

        const monthlyEntry = getService.trip_stats.monthly.find(e => e.month === month);
        if (monthlyEntry) {
            monthlyEntry.total_distance += distance;
            monthlyEntry.total_fare += fare;
            monthlyEntry.total_tip += tip;
            monthlyEntry.total_earnings += fare + tip;
            monthlyEntry.total_trips += 1;
        } else {
            getService.trip_stats.monthly.push({
                month,
                total_distance: distance,
                total_fare: fare,
                total_tip: tip,
                total_earnings: fare + tip,
                total_trips: 1
            });
        }

        const dailyEntry = getService.trip_stats.daily.find(e => e.date === date);
        if (dailyEntry) {
            dailyEntry.total_distance += distance;
            dailyEntry.total_fare += fare;
            dailyEntry.total_tip += tip;
            dailyEntry.total_earnings += fare + tip;
            dailyEntry.total_trips += 1;
        } else {
            getService.trip_stats.daily.push({
                date,
                total_distance: distance,
                total_fare: fare,
                total_tip: tip,
                total_earnings: fare + tip,
                total_trips: 1
            });
        }

        await getService.save();

        res.status(200).json({
            status: "success",
            message: "Successfuly add trip data",
            data: {}
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
    create,
    list,
    read,
    reply
};