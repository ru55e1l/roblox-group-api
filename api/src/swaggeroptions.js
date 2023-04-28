const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Clan API',
            description: 'Manage 44th',
            version: '1.0.0',
            servers: [{ url: 'http://localhost:1534' }],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Member: {
                    type: 'object',
                    properties: {
                        robloxId: {
                            type: 'integer',
                            format: 'int32',
                            description: 'The Roblox ID of the member',
                        },
                        Birthday: {
                            type: 'string',
                            format: 'date',
                            description: 'The birthday of the member (YYYY-MM-DD)',
                        },
                        joinDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The date the member joined (ISO 8601 format)',
                        },
                        infamy: {
                            type: 'number',
                            format: 'decimal',
                            description: 'The infamy of the member',
                        },
                    },
                    required: ['robloxId'],
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

module.exports = swaggerOptions;
