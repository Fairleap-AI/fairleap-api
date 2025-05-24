const fin_tips = async (req, res) => {
    try {
        const { pendapatan, pengeluaran, toleransi_risiko } = req.body;

        if (!pendapatan || !pengeluaran || !toleransi_risiko) {
            let invalidItems = [];
            if (!pendapatan) invalidItems.push('"pendapatan"');
            if (!pengeluaran) invalidItems.push('"pengeluaran"');
            if (!toleransi_risiko) invalidItems.push('"toleransi_risiko"');
            return res.status(400).json({
                status: 'error',
                message: `Parameter ${invalidItems.join(", ")} required`,
                data: {}
            });
        }

        const requestBody = {
            pendapatan,
            pengeluaran,
            toleransi_risiko
        };

        const response = await fetch(process.env.FAIRLEAP_AI_HOST + "/llm/fin_tips", {
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

        return res.status(200).json({
            status: 'success',
            message: "Successfuly get financial advice",
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

const wellness = async (req, res) => {
    try {
        const { energy_level, stress_level, sleep_quality, physical_condition } = req.body;

        if (!energy_level || !stress_level || !sleep_quality || !physical_condition) {
            let invalidItems = [];
            if (!energy_level) invalidItems.push('"energy_level"');
            if (!stress_level) invalidItems.push('"stress_level"');
            if (!sleep_quality) invalidItems.push('"sleep_quality"');
            if (!physical_condition) invalidItems.push('"physical_condition"');
            return res.status(400).json({
                status: 'error',
                message: `Parameter ${invalidItems.join(", ")} required`,
                data: {}
            });
        }

        const requestBody = {
            energy_level,
            stress_level,
            sleep_quality,
            physical_condition
        };

        const response = await fetch(process.env.FAIRLEAP_AI_HOST + "/llm/wellness", {
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

        return res.status(200).json({
            status: 'success',
            message: "Successfuly get wellness advice",
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

const invest = async (req, res) => {
    try {
        const { pendapatan, pengeluaran, toleransi_risiko } = req.body;

        if (!pendapatan || !pengeluaran || !toleransi_risiko) {
            let invalidItems = [];
            if (!pendapatan) invalidItems.push('"pendapatan"');
            if (!pengeluaran) invalidItems.push('"pengeluaran"');
            if (!toleransi_risiko) invalidItems.push('"toleransi_risiko"');
            return res.status(400).json({
                status: 'error',
                message: `Parameter ${invalidItems.join(", ")} required`,
                data: {}
            });
        }

        const requestBody = {
            pendapatan,
            pengeluaran,
            toleransi_risiko
        };

        const response = await fetch(process.env.FAIRLEAP_AI_HOST + "/llm/invest", {
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

        return res.status(200).json({
            status: 'success',
            message: "Successfuly get investment advice",
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
    fin_tips,
    wellness,
    invest
}