const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const event = new mongoose.Schema({
    eventDate: {
        type: Date,
        default: Date.now
    },

});
event.pre('save', async function (next) {
    next();
});


event.plugin(passportLocalMongoose);
module.exports = mongoose.model('Event', event);
