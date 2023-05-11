const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');

const infamyLog = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    infamyAmount: {
        type: Number,
        required: true
    },
    successful: {
        type: [String],
        required: true
    },
    error: {
        type: [String],
        required: true
    },
    addInfamy: {
        type: Boolean,
        required: true
    },
    logDate: {
        type: Date,
        default: Date.now
    },

});
infamyLog.pre('save', async function (next) {
    next();
});


infamyLog.plugin(passportLocalMongoose);
module.exports = mongoose.model('InfamyLog', infamyLog);
