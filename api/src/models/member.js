const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const member = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true,
    },
    robloxId: {
        type: Number,
        required: true,
        unique: true,
    },
    Birthday: {
        type: Date,
        required: false,
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    infamy: {
        type: mongoose.Decimal128,
        required: false,
        default: 0,
    },
});
member.pre('save', async function (next) {
    this.infamy = 0;
    this.username = await noblox.getUsernameFromId(this.robloxId);
    next();
});


member.plugin(passportLocalMongoose);
module.exports = mongoose.model('Member', member);
