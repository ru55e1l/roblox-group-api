const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const pendingEvent = new mongoose.Schema({
    eventDate: {
        type: Date,
        default: Date.now
    },
    eventType: {
        type: String,
        enum: ['Raid', 'Defense', 'Gamenight'],
        required: true
    },
    host: {
        type: String,
        required: true
    },
    usernames: {
        type: [String],
        required: true
    },
    infamyToAdd: {
        type: Number,
        required: true
    },
    victory: {
        type: Boolean,
        required: true
    }
});
pendingEvent.pre('save', async function (next) {
    next();
});

pendingEvent.plugin(passportLocalMongoose);
module.exports = mongoose.model('PendingEvent', pendingEvent);
