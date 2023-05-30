const PendingEvent = require('../models/pendingEvent');
const GenericService = require('./generic-service');
const memberService = require('./member-service');
const noblox = require('noblox.js');
const mongoose = require('mongoose');
const infamyService = require('./infamy-service');
class PendingEventService extends GenericService {
    constructor() {
        super(PendingEvent);
    }

    async LogPendingEvent(data) {
        try {
            const dto = {
                eventDate: data.eventDate || Date.now(),
                eventType: data.eventType,
                host: await noblox.getIdFromUsername(data.host),
                usernames: (await Promise.all(data.usernames.map(async (username) => {
                    let robloxId = await noblox.getIdFromUsername(username)
                    if(await memberService.verifyUserInGroup(robloxId)) {
                        return robloxId
                    }
                }))).filter(id => id !== undefined),
                infamyToAdd: data.infamyToAdd,
                victory: data.victory
            };

            await this.createDocument(dto);
        } catch (err) {
            console.error(err);
            throw err
        }
    }


}


module.exports = new PendingEventService();
