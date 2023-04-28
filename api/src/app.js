require('dotenv').config();
const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const swaggerOptions = require('./swaggeroptions');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// routes
const memberRouter = require('./routes/member-router');


const app = express();
app.use(cookieParser(process.env.SECRET))
app.use(express.json()); // for parsing application/json
const port = process.env.PORT || 1534;


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use trainerRouter middleware
app.use('/api/member', memberRouter);


mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});