const InfamyLog = require('../models/infamyLog');
const GenericService = require('./generic-service');


class InfamyLogService extends GenericService {
    constructor() {
        super(InfamyLog);
    }
}

module.exports = new InfamyLogService();
