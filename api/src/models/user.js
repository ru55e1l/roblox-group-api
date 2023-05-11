const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: false,
    },
    roles: {
        type: [String],
        required: true,
        default: ['user'],
    },
});
user.pre('save', async function (next) {

});


user.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', user);
