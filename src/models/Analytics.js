const mongoose = require("mongoose");
const { Schema } = mongoose;

const analyticsSchema = new Schema(
    {
        url: {
            type: Schema.Types.ObjectId,
            ref: "URL",
            required: true,
            index: true,
        },
        ip: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        browser: {
            type: String,
        },
        os: {
            type: String,
        },
        deviceType: {
            type: String,
        },
        referrer: {
            type: String,
            default: "Direct",
        },
        userAgent: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("analytics", analyticsSchema);
