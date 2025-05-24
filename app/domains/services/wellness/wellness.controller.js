const Service = require('../services.model').Service;

const create = async (req, res) => {
    try {
        const { score, time } = req.body;

        if (!score || !time) {
            let invalidItems = [];
            if (!score) invalidItems.push('"score"');
            if (!time) invalidItems.push('"time"');
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

        getService.wellness_logs.push({
            score,
            time
        })

        const d = new Date(time);
        const year = d.getFullYear().toString();
        const month = `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}`;
        const date = `${d.getFullYear()}-${("0" + (d.getMonth()+1).toString()).slice(-2)}-${("0" + d.getDate().toString()).slice(-2)}`;

        const yearlyEntry = getService.wellness_stats.yearly.find(e => e.year === year);
        if (yearlyEntry) {
            yearlyEntry.total_score += score;
            yearlyEntry.total_test += 1;
            yearlyEntry.avg_score += yearlyEntry.total_score / yearlyEntry.total_test;
        } else {
            getService.wellness_stats.yearly.push({
                year,
                total_score: score,
                total_test: 1,
                avg_score: score,
            });
        }

        const monthlyEntry = getService.wellness_stats.monthly.find(e => e.month === month);
        if (monthlyEntry) {
            monthlyEntry.total_score += score;
            monthlyEntry.total_test += 1;
            monthlyEntry.avg_score += monthlyEntry.total_score / monthlyEntry.total_test;
        } else {
            getService.wellness_stats.monthly.push({
                month,
                total_score: score,
                total_test: 1,
                avg_score: score,
            });
        }

        const dailyEntry = getService.wellness_stats.daily.find(e => e.date === date);
        if (dailyEntry) {
            dailyEntry.total_score += score;
            dailyEntry.total_test += 1;
            dailyEntry.avg_score += dailyEntry.total_score / dailyEntry.total_test;
        } else {
            getService.wellness_stats.daily.push({
                date,
                total_score: score,
                total_test: 1,
                avg_score: score,
            });
        }

        await getService.save();

        res.status(200).json({
            status: "success",
            message: "Successfuly add wellness test data",
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
    create
};