const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const event = new mongoose.Schema({
    eventDate: {
        type: Date,
        default: Date.now,
        unique: false,
    },
    eventType: {
        type: String,
        enum: ['Raid', 'Defense', 'Gamenight'],
        required: true,
        unique: false,
    },
    host: {
        type: String,
        required: true,
        unique: false,
    },
    attendeesSuccessful: {
        type: [String],
        required: true,
        unique: false,
    },
    attendeesError: {
        type: [String],
        required: true,
        unique: false,
    },
    infamyGiven: {
        type: Number,
        required: true,
        unique: false,
    },
    victory: {
        type: Boolean,
        required: true,
        unique: false,
    },
    screenshot: {
        type: String,
        required: true,
        unique: false,
    }
});
event.pre('save', async function (next) {
    next();
});
module.exports = mongoose.model('Event', event);
