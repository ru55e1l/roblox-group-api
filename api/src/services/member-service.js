const Member = require('../models/member');
const GenericService = require('./generic-service');
const noblox = require('noblox.js');
const axios = require('axios');

class MemberService extends GenericService {
    constructor() {
        super(Member);
    }
    async createMember(memberData) {
        try {
            const existingMember = await this.getDocumentByField({robloxId: memberData.robloxId});
            if(existingMember) {
                throw new Error(`${memberData.robloxId} already in system`);
            }
            const newMember = new Member({
                robloxId: memberData.robloxId,
                Birthday: memberData.Birthday,
            });
            return await this.createDocument(newMember);
        } catch(error) {
            throw error;
        }
    }

    async resetInfamyAndPrestige() {
        try {
            const members = await Member.find({});
            for (let member of members) {
                member.infamy = member.totalInfamy;
                member.prestigeCount = 0;
                await member.save();
            }
            console.log('Successfully updated all members.');
        } catch (err) {
            console.error('An error occurred while updating all members:', err);
        }
    }


    async verifyMember(robloxId) {
        try {
            const existingMember = await this.getDocumentByField({robloxId: robloxId});
            if(!existingMember) {
                const newMember = new Member({
                    robloxId: robloxId,
                });
                await createMember(newMember);
            }



        } catch(error) {
            throw error;
        }
    }

    async verifyUserInGroup(robloxId) {
        try {
            const rank = await noblox.getRankInGroup(process.env.GROUPID, robloxId);
            if(rank > 0) {
                return true;
            }
            else {
                return false;
            }
        } catch(error) {
            throw error;
        }
    }

    async getHeadshotUrl(robloxId) {
        const thumbnailUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxId}&size=150x150&format=Png&isCircular=true`;
        try {
            const response = await axios.get(thumbnailUrl);
            if (response.status === 200) {
                const headshotUrl = response.data.data[0].imageUrl;
                return headshotUrl;
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async updateHeadshotUrls() {
        // Find all members in the collection
        const members = await Member.find({});

        // Loop through each member and update the headshotUrl
        for (const member of members) {
            const headshotUrl = await this.getHeadshotUrl(member.robloxId);
            member.infamy = member.infamy;
            member.headshotUrl = headshotUrl;
            await member.save();
        }

        console.log('All documents updated with headshotUrl');
    }

    async updateInfamyByUsername(membersData) {
        for (const memberData of membersData) {
            const { username, infamy } = memberData;
            await Member.updateOne({ username }, { infamy });
        }
    }

}


module.exports = new MemberService();
