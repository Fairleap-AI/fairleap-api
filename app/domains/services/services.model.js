const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    email: { type: String, required: true },
    trip_logs: [{
        distance: { type: Number, required: true },
        fare: { type: Number, required: true },
        tip: { type: Number, required: true },
        duration: { type: Number, required: true },
        time_start: { type: Date, required: true },
        time_end: { type: Date, required: true }
    }],
    trip_stats: {
        daily: [{
            date: { type: String, required: true },
            total_distance: { type: Number, required: true },
            total_fare: { type: Number, required: true },
            total_tip: { type: Number, required: true },
            total_earnings: { type: Number, required: true },
            total_trips: { type: Number, required: true }
        }],
        monthly: [{
            month: { type: String, required: true },
            total_distance: { type: Number, required: true },
            total_fare: { type: Number, required: true },
            total_tip: { type: Number, required: true },
            total_earnings: { type: Number, required: true },
            total_trips: { type: Number, required: true }
        }],
        yearly: [{
            year: { type: String, required: true },
            total_distance: { type: Number, required: true },
            total_fare: { type: Number, required: true },
            total_tip: { type: Number, required: true },
            total_earnings: { type: Number, required: true },
            total_trips: { type: Number, required: true }
        }]
    },
    chatSession: [{
        chatData: [{
            content: { type: String, required: false },
            role: { type: String, required: false }
        }]
    }],
    wellness_logs: [{
        score: { type: Number, required: true },
        time: { type: Date, required: true }
    }],
    wellnes_stats: {
        daily: [{
            date: { type: String, required: true },
            total_score: { type: Number, required: true },
            total_test: { type: Number, required: true },
            avg_score: { type: Number, required: true },
        }],
        monthly: [{
            month: { type: String, required: true },
            total_score: { type: Number, required: true },
            total_test: { type: Number, required: true },
            avg_score: { type: Number, required: true },
        }],
        yearly: [{
            year: { type: String, required: true },
            total_score: { type: Number, required: true },
            total_test: { type: Number, required: true },
            avg_score: { type: Number, required: true },
        }],
    }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = {
    Service
};