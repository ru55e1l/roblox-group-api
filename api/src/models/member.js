const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const noblox = require('noblox.js');
const axios = require('axios');

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
    discordId: {
        type: Number,
        required: false,
        unique: false,
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
    prestigeCount: {
        type: Number,
        required: false,
        default: 0
    },
    totalInfamy: {
        type: mongoose.Decimal128,
        required: false,
        default: 0,
    },
    headshotUrl: {
        type: String,
        required: false,
    }
});

async function getHeadshotUrl(robloxId) {
    const thumbnailUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxId}&size=48x48&format=Png&isCircular=true`;
    try {
        const response = await axios.get(thumbnailUrl);
        if (response.status === 200) {
            const thumbnailUrl = response.data.data[0].imageUrl;
            return thumbnailUrl;
        } else {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}
member.pre('save', async function (next) {
    this.username = await noblox.getUsernameFromId(this.robloxId);
    this.headshotUrl = await getHeadshotUrl(this.robloxId);
    next();
});


member.plugin(passportLocalMongoose);
module.exports = mongoose.model('Member', member);
