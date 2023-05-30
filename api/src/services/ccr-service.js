const noblox = require('noblox.js')
const axios = require('axios');

class CCRService {
    constructor() {
    }

    async GetHistory(username) {
        try {
            let robloxId = await noblox.getIdFromUsername(username);
            let response = await axios.get(`https://ccr.catgang.ru/check.php?uid=${robloxId}&format=json`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new CCRService();