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
const noblox = require('noblox.js');

// routes
const memberRouter = require('./routes/member-router');
const infamyRouter = require('./routes/infamy-router');

const app = express();
app.use(cookieParser(process.env.SECRET))
app.use(express.json()); // for parsing application/json

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use trainerRouter middleware
app.use('/api/member', memberRouter);
app.use('/api/infamy', infamyRouter);



mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err));
noblox.setCookie(process.env.COOKIE).then(function() { //Use COOKIE from our .env file.
    console.log("Logged in!")
}).catch(function(err) {
    console.log("Unable to log in!", err)
})


module.exports = app;