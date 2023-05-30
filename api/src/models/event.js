const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const event = new mongoose.Schema({
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
    attendeesSuccessful: {
        type: [String],
        required: true
    },
    attendeesError: {
        type: [String],
        required: true
    },
    infamyGiven: {
        type: Number,
        required: true
    },
    victory: {
        type: Boolean,
        required: true
    }
});
event.pre('save', async function (next) {
    next();
});

event.plugin(passportLocalMongoose);
module.exports = mongoose.model('Event', event);
