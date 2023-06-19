const InfamyLog = require('../models/infamyLog');
const GenericService = require('./generic-service');


class InfamyLogService extends GenericService {
    constructor() {
        super(InfamyLog);
    }
    async getLatestTenLogs() {
        try {
            const logs = await InfamyLog.find({}).sort('-logDate').limit(10).exec();
            return logs;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new InfamyLogService();
