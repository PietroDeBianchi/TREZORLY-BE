const mongoose = require("mongoose");
const { Schema } = mongoose;

const analyticsSchema = new Schema(
    {
        url: {
            type: Schema.Types.ObjectId,
            ref: "URL",
            required: true,
        },
        clicks: {
            type: Number,
            default: 0,
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
        referrer: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Abilita l'autopopulate per il riferimento all'URL
analyticsSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Analytics", analyticsSchema);
