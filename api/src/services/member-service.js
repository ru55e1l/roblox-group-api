const Member = require('../models/member');
const GenericService = require('./generic-service');
const noblox = require('noblox.js');

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

}


module.exports = new MemberService();
