const Event = require('../models/event');
const GenericService = require('./generic-service');
const memberService = require('./member-service');
const noblox = require('noblox.js');
const mongoose = require('mongoose');
const infamyService = require('./infamy-service');
class EventService extends GenericService {
    constructor() {
        super(Event);
    }

    async LogEvent(data) {
        try {
            const infamyResult = await infamyService.bulkAddInfamy(data.host, data.usernames, data.infamyToAdd);

            const dto = {
                eventDate: data.eventDate || Date.now(),
                eventType: data.eventType,
                host: await noblox.getIdFromUsername(data.host),
                attendeesSuccessful: await Promise.all(infamyResult.successful.map(async (username) => {
                    return await noblox.getIdFromUsername(username);
                })),
                attendeesError: await Promise.all(infamyResult.error.map(async (err) => {
                    const username = err.split(' - ')[0];
                    return await noblox.getIdFromUsername(username);
                })),
                infamyGiven: data.infamyToAdd,
                victory: data.victory,
                screenshot: data.screenshot
            };

            await this.createDocument(dto);
        } catch (err) {
            console.error(err);
            throw err
        }
    }

    async getEventsAttendedByUsername(username) {
        try {
            // Get the Roblox ID of the user
            const userId = await noblox.getIdFromUsername(username);

            // Find events where the user was successfully added
            const eventsAttended = await Event.find({
                attendeesSuccessful: userId
            });

            // Initialize counts
            let totalCount = eventsAttended.length;
            let raidCount = 0;
            let defenseCount = 0;
            let gameNightCount = 0;

            // Count event types
            eventsAttended.forEach(event => {
                switch(event.eventType) {
                    case 'Raid':
                        raidCount++;
                        break;
                    case 'Defense':
                        defenseCount++;
                        break;
                    case 'Gamenight':
                        gameNightCount++;
                        break;
                }
            });

            return {
                totalCount,
                raidCount,
                defenseCount,
                gameNightCount,
                eventsAttended
            };
        } catch (err) {
            console.error(err);
            // handle the error as needed
        }
    }

    async getEventsHostedByUsername(username) {
        try {
            const userId = await noblox.getIdFromUsername(username);
            // Find events where the user was the host
            const eventsHosted = await Event.find({
                host: userId
            });

            // Initialize counts
            let totalCount = eventsHosted.length;
            let raidCount = 0;
            let defenseCount = 0;
            let gameNightCount = 0;

            // Count event types
            eventsHosted.forEach(event => {
                switch(event.eventType) {
                    case 'Raid':
                        raidCount++;
                        break;
                    case 'Defense':
                        defenseCount++;
                        break;
                    case 'Gamenight':
                        gameNightCount++;
                        break;
                }
            });

            return {
                totalCount,
                raidCount,
                defenseCount,
                gameNightCount,
                eventsHosted
            };
        } catch (err) {
            console.error(err);
            // handle the error as needed
        }
    }

}


module.exports = new EventService();
