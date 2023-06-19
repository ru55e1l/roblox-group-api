const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const pendingEvent = new mongoose.Schema({
    eventDate: {
        type: Date,
        default: Date.now,
        unique: false
    },
    eventType: {
        type: String,
        enum: ['Raid', 'Defense', 'Gamenight'],
        required: true,
        unique: false
    },
    host: {
        type: String,
        required: true,
        unique: false
    },
    usernames: {
        type: [String],
        required: true,
        unique: false
    },
    infamyToAdd: {
        type: Number,
        required: true,
        unique: false
    },
    victory: {
        type: Boolean,
        required: true,
        unique: false
    },
    screenshot: {
        type: String,
        required: true,
        unique: false
    }
});
pendingEvent.pre('save', async function (next) {
    next();
});
module.exports = mongoose.model('PendingEvent', pendingEvent);
