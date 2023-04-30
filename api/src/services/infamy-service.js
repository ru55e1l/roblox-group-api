const Member = require('../models/member');
const GenericService = require('./generic-service');
const memberService = require('./member-service');
const noblox = require('noblox.js');
class InfamyService extends GenericService {
    constructor() {
        super(Member);
    }

    async addInfamy(robloxId, infamyToAdd) {
        try {
            let existingMember = await this.getDocumentByField({robloxId: robloxId});
            if(!existingMember) {
                if(await memberService.verifyUserInGroup(robloxId)) {
                    const newMember = new Member({
                        robloxId: robloxId,
                    });
                    existingMember = await memberService.createMember(newMember);
                }
            }

            existingMember.infamy = existingMember.infamy + infamyToAdd;
            return await this.updateDocumentById(existingMember.id, existingMember);
        }catch(error) {
            throw error
        }
    }

    async bulkAddInfamy(usernames, infamyToAdd) {
        try {
            const errorMessages = [];
            for (const username of usernames) {
                try {
                    const robloxId = await noblox.getIdFromUsername(username);
                    if(robloxId) {
                        await this.addInfamy(robloxId, infamyToAdd);
                    }
                } catch (error) {
                    errorMessages.push({
                        username: username,
                        message: error.message,
                    });
                }
            }
            return { errorMessages };
        } catch (error) {
            console.log(error.message);
        }
    }

    async getTopInfamy() {
        try {
            const members = await this.getAllDocuments();
            const sortedMembers = members.sort((a, b) => b.infamy - a.infamy);
            const topMembers = sortedMembers.slice(0, 10);

            return topMembers.map(member => ({
                username: member.username,
                infamy: parseFloat(member.infamy.toString()),
            }));
        } catch (error) {
            throw new Error(`Error getting top infamy: ${error.message}`);
        }
    }


    async getInfamyByUsername(username) {
        try {
            const robloxId = await noblox.getIdFromUsername(username);
            const member = await memberService.getDocumentByField({ robloxId: robloxId });
            if (!member) {
                throw new Error(`Member not found for username ${username}`);
            }
            return member.infamy;
        } catch (error) {
            throw new Error(`Error getting infamy for username ${username}: ${error.message}`);
        }
    }



}


module.exports = new InfamyService();
