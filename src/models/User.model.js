const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
        },
        roles: {
            type: String,
            enum: ['user', 'admin', 'superadmin'],
            default: 'user',
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

// Use to autopopulate reference with entity ID
userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('users', userSchema);
