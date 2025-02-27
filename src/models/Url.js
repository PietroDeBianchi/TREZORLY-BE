const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            required: true,
            unique: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        analytics: {
            type: [Schema.Types.ObjectId],
            ref: "analytics",
            autopopulate: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Use to autopopulate reference with entity ID
urlSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("urls", urlSchema);