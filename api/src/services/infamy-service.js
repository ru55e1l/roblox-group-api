const Member = require('../models/member');
const GenericService = require('./generic-service');
const memberService = require('./member-service');
const noblox = require('noblox.js');
const Ranks = require('../constants/infamyToRank');
const mongoose = require('mongoose');
const infamyLogService = require('./infamyLog-service')

class InfamyService extends GenericService {
    constructor() {
        super(Member);
    }

    async updateRankBasedOnInfamy(robloxId, infamy) {
        const currentRankName = await noblox.getRankNameInGroup(process.env.GROUPID, robloxId);
        const currentRank = await noblox.getRankInGroup(process.env.GROUPID, robloxId);
        const infamyDecimal = new mongoose.Types.Decimal128(infamy.toString());

        if (currentRank < 34) {
            let newRankName = "Privateer";

            for (const [rankName, rankInfamy] of Object.entries(Ranks)) {
                if (parseFloat(infamyDecimal.toString()) >= rankInfamy) {
                    newRankName = rankName;
                } else {
                    break;
                }
            }

            if (newRankName !== currentRankName) {
                await noblox.setRank(process.env.GROUPID, robloxId, newRankName);
            }
        }
    }

    async updateLeaderboardRank(robloxId, newInfamy) {
        const members = await Member.find();
        const sortedMembers = members.sort((a, b) => parseFloat(b.infamy.toString()) - parseFloat(a.infamy.toString()));
        let leaderboard = 1;
        for (const member of sortedMembers) {
            await Member.updateOne({ robloxId }, { leaderboard });
            leaderboard++;
        }
    }

    async addInfamy(robloxId, infamyToAdd) {
        try {
            let existingMember = await this.getDocumentByField({ robloxId: robloxId });

            if (!existingMember) {
                if (await memberService.verifyUserInGroup(robloxId)) {
                    const newMember = new Member({
                        robloxId: robloxId,
                    });
                    existingMember = await memberService.createMember(newMember);
                }
                else {
                    throw new Error("User is not in group");
                }
            }

            // Parse infamyToAdd as a number
            const parsedInfamyToAdd = parseFloat(infamyToAdd);
            existingMember.infamy = parseFloat(existingMember.infamy) + parsedInfamyToAdd;

            await this.updateRankBasedOnInfamy(robloxId, existingMember.infamy);
            return await this.updateDocumentById(existingMember.id, existingMember);
        } catch (error) {
            throw error;
        }
    }

    async removeInfamy(robloxId, infamyToRemove) {
        try {
            let existingMember = await this.getDocumentByField({ robloxId: robloxId });

            if (!existingMember) {
                throw new Error(`Member not found`);
            }
            const parsedInfamyToRemove = parseFloat(infamyToRemove);
            existingMember.infamy = Math.max(0, parseFloat(existingMember.infamy) - parsedInfamyToRemove);
            await this.updateRankBasedOnInfamy(robloxId, existingMember.infamy);
            return await this.updateDocumentById(existingMember.id, existingMember);
        } catch (error) {
            throw error;
        }
    }



    async bulkAddInfamy(apiUser, usernames, infamyToAdd) {
        try {
            const result = {
                username: apiUser,
                infamyAmount: infamyToAdd,
                successful: [],
                error: [],
                addInfamy: true
            };
            for (const username of usernames) {
                try {
                    const robloxId = await noblox.getIdFromUsername(username);
                    if(robloxId) {
                        await this.addInfamy(robloxId, infamyToAdd);
                        result.successful.push(username);
                    }
                    else {
                        throw Error("User does not exist")
                    }

                } catch (error) {
                    result.error.push(`${username} - ${error.message}`);
                }
            }
            await infamyLogService.createDocument(result);
            return result ;
        } catch (error) {
            console.log(error.message);
        }
    }

    async bulkRemoveInfamy(apiUser, usernames, infamyToRemove) {
        try {
            const result = {
                username: apiUser,
                infamyAmount: infamyToRemove,
                successful: [],
                error: [],
                addInfamy: false
            };
            for (const username of usernames) {
                try {
                    const robloxId = await noblox.getIdFromUsername(username);
                    if (robloxId) {
                        await this.removeInfamy(robloxId, infamyToRemove);
                    }
                    result.successful.push(username);
                } catch (error) {
                    result.error.push(`${username} - ${error.message}`);
                }
            }
            await infamyLogService.createDocument(result);
            return result;
        } catch (error) {
            console.log(error.message);
        }
    }


    async getTopInfamy() {
        try {
            const members = await this.getAllDocuments();
            const sortedMembers = members.sort((a, b) => b.infamy - a.infamy);

            const rankedMembers = await Promise.all(sortedMembers.map(async (member, index) => {
                const username = await noblox.getUsernameFromId(member.robloxId);
                return {
                    rank: index + 1,
                    username,
                    robloxId: member.robloxId,
                    headshotUrl: member.headshotUrl,
                    infamy: parseFloat(member.infamy.toString()),
                };
            }));

            return rankedMembers;
        } catch (error) {
            throw new Error(`Error getting top infamy: ${error.message}`);
        }
    }



    async getInfamyAndRankByUsername(username) {
        try {
            const robloxId = await noblox.getIdFromUsername(username);
            const members = await memberService.getAllDocuments();
            const sortedMembers = members.sort((a, b) => b.infamy - a.infamy);
            const memberIndex = sortedMembers.findIndex((member) => member.robloxId === robloxId);

            if (memberIndex === -1) {
                throw new Error(`Member not found for username ${username}`);
            }



            const member = sortedMembers[memberIndex];
            const leaderboardRank = memberIndex + 1
            const currentInfamy = member.infamy;
            const currentRankIndex = Object.values(Ranks).findIndex((infamyRequirement) => currentInfamy < infamyRequirement);
            const nextRank = Object.keys(Ranks)[currentRankIndex];
            const infamyToGain = Ranks[nextRank] - currentInfamy;
            const groupRank = await noblox.getRankNameInGroup(process.env.GROUPID, member.robloxId);
            const groupRankNum = await noblox.getRankInGroup(process.env.GROUPID, member.robloxId);
            let nextRankOutput = nextRank;
            let infamyToGainString = infamyToGain.toString();
            if(groupRankNum > 34) {
                infamyToGainString = "NaN";
                nextRankOutput = "NaN";
            }
            const updatedUsername = await noblox.getUsernameFromId(member.robloxId);
            await memberService.updateDocumentById(member._id, member);

            return { username: updatedUsername, groupRank: groupRank, nextGroupRank: nextRankOutput, robloxId: member.robloxId, infamy: currentInfamy.toString(), leaderboardrank: leaderboardRank, infamyToGain: infamyToGainString, headshotUrl: member.headshotUrl };
        } catch (error) {
            throw new Error(`Error getting infamy for username ${username}: ${error.message}`);
        }
    }




}


module.exports = new InfamyService();
