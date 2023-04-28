const Member = require('../models/member');
const RefreshToken = require('../models/refreshToken')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const GenericService = require('./generic-service');

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
        return await this.createDocument(memberData);
    } catch(error) {
        throw error;
    }
}


}


module.exports = new MemberService();
