const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const member = new mongoose.Schema({
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
        required: true,
        default: 0,
    },
});
member.pre('save', async function (next) {
    this.infamy = 0;
    next();
});


member.plugin(passportLocalMongoose);
module.exports = mongoose.model('Member', member);
