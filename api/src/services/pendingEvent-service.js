const PendingEvent = require('../models/pendingEvent');
const GenericService = require('./generic-service');
const memberService = require('./member-service');
const noblox = require('noblox.js');
const mongoose = require('mongoose');
const infamyService = require('./infamy-service');
const eventService = require('./event-service');
class PendingEventService extends GenericService {
    constructor() {
        super(PendingEvent);
    }

    async LogPendingEvent(data) {
        try {
            // Get the Roblox ID of the host
            const hostRobloxId = await noblox.getIdFromUsername(data.host);
            // Verify host
            const isHostValid = await memberService.verifyUserInGroup(hostRobloxId);
            if (!isHostValid) {
                throw new Error('Host is not a valid group member');
            }

            // Get the Roblox IDs of the attendees
            const attendeesRobloxIds = await Promise.all(data.usernames.map(noblox.getIdFromUsername));

            // Verify attendees
            const areAttendeesValid = await Promise.all(attendeesRobloxIds.map(memberService.verifyUserInGroup));

            if (areAttendeesValid.some(valid => !valid)) {
                throw new Error('One or more attendees are not valid group members');
            }

            const dto = {
                eventDate: data.eventDate || Date.now(),
                eventType: data.eventType,
                host: data.host,
                usernames: data.usernames,
                infamyToAdd: data.infamyToAdd,
                victory: data.victory,
                screenshot: data.screenshot
            };

            return await this.createDocument(dto);
        } catch (err) {
            console.error(err);
            throw err
        }
    }

    async getAllPendingEvents() {
        try {
            return await this.getAllDocuments();
        } catch (err) {
            console.error(err);
            throw err
        }
    }


    async createEventFromPendingEvent(pendingEventId) {
        try {
            // Retrieve the pending event by its ID
            const pendingEvent = await this.getDocumentById(pendingEventId);

            if(!pendingEvent) {
                console.error('No PendingEvent found with this ID.');
                return null;
            }

            // Create data for the new event based on the pending event
            const data = {
                eventDate: pendingEvent.eventDate,
                eventType: pendingEvent.eventType,
                host: pendingEvent.host,
                usernames: pendingEvent.usernames,
                infamyToAdd: pendingEvent.infamyToAdd,
                victory: pendingEvent.victory,
                screenshot: pendingEvent.screenshot
            };

            // Log the new event using the provided LogEvent function
            const result = await eventService.LogEvent(data);

            // Delete the pending event
            const deletedPendingEvent = await this.deleteDocumentById(pendingEventId);

            return result;
        } catch (error) {
            console.error(`Failed to create Event from PendingEvent: ${error}`);
            throw error;
        }
    }


}


module.exports = new PendingEventService();
