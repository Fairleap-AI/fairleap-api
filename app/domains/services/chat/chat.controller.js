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

        const savedData = await getService.save();

        res.status(200).json({
            status: "success",
            message: "Successfuly create new chat",
            data: {
                id: savedData.chatSession.slice(-1)[0]._id,
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
        const { id, query } = req.body;

        if (!id || !query) {
            let invalidItems = [];
            if (!id) invalidItems.push('"id"');
            if (!query) invalidItems.push('"query"');
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

        const requestBody = {
            query,
            messages: getService.chatSession[0].chatData.map(({ _id, content, role }) => ({content, role}))
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

        await Service.findOneAndUpdate(
            { 
                email: req.user.email, 
                "chatSession._id": id 
            },{ 
                $push: { 
                    "chatSession.$.chatData": { $each: data.messages.slice(-2) }
                }
            }
        );

        res.status(200).json({
            status: "success",
            message: "Successfuly add new reply",
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

module.exports = {
    create,
    list,
    read,
    reply
};