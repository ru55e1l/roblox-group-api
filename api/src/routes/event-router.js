const express = require('express');
const router = express.Router();
const eventService = require('../services/event-service');
const pendingEventService = require('../services/pendingEvent-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: API for managing Events
 */

/**
 * @swagger
 * /api/Event/logEvent:
 *   post:
 *     summary: Logs an event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Event data to log
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernames:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The usernames of the attendees
 *               infamyToAdd:
 *                 type: number
 *                 format: decimal
 *                 description: The amount of infamy to add to each member
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *               eventType:
 *                 type: string
 *                 description: The type of the event
 *               host:
 *                 type: string
 *                 description: The host of the event
 *               victory:
 *                 type: boolean
 *                 description: did you win
 *             required:
 *               - usernames
 *               - infamyToAdd
 *               - eventType
 *               - host
 *               - victory
 *     responses:
 *       200:
 *         description: Event logged successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */

router.post("/logEvent", [auth, user], async (req, res) => {
    try {
        await eventService.LogEvent(req.body);
        res.status(200).send("Event logged successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /api/Event/logPendingEvent:
 *   post:
 *     summary: Logs a pending event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Pending event data to log
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernames:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The usernames of the attendees
 *               infamyToAdd:
 *                 type: number
 *                 format: decimal
 *                 description: The amount of infamy to add to each member
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the event
 *               eventType:
 *                 type: string
 *                 description: The type of the event
 *               host:
 *                 type: string
 *                 description: The host of the event
 *               victory:
 *                 type: boolean
 *                 description: did you win
 *               screenshot:
 *                 type: string
 *                 description: Screenshot of the event
 *             required:
 *               - usernames
 *               - infamyToAdd
 *               - eventType
 *               - host
 *               - victory
 *               - screenshot
 *     responses:
 *       200:
 *         description: Pending event logged successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
router.post("/logPendingEvent", [auth, user], async (req, res) => {
    try {
        result = await pendingEventService.LogPendingEvent(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});




/**
 * @swagger
 * /api/Event/getEventsAttendedByUsername/{username}:
 *   get:
 *     summary: Gets the events attended by a user
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the member
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid username
 *       500:
 *         description: Internal Server Error
 */
router.get("/getEventsAttendedByUsername/:username", [auth, user], async (req, res) => {
    try {
        const events = await eventService.getEventsAttendedByUsername(req.params.username);
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /api/Event/createEventFromPending/{pendingEventId}:
 *   post:
 *     summary: Creates a new event from a pending event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pendingEventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the pending event
 *     responses:
 *       200:
 *         description: New event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Pending event not found
 *       500:
 *         description: Internal Server Error
 */

router.post("/createEventFromPending/:pendingEventId", [auth, user], async (req, res) => {
    try {
        const newEvent = await pendingEventService.createEventFromPendingEvent(req.params.pendingEventId);
        res.status(200).send("Success");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /api/Event/getEventsHostedByUsername/{username}:
 *   get:
 *     summary: Retrieves the count of all events and each type of event hosted by a user
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the host
 *     responses:
 *       200:
 *         description: Event count successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of events hosted by the user
 *                 raidCount:
 *                   type: integer
 *                   description: The count of 'Raid' events hosted by the user
 *                 defenseCount:
 *                   type: integer
 *                   description: The count of 'Defense' events hosted by the user
 *                 gameNightCount:
 *                   type: integer
 *                   description: The count of 'GameNight' events hosted by the user
 *       400:
 *         description: Invalid username
 *       500:
 *         description: Internal Server Error
 */
router.get("/getEventsHostedByUsername/:username", async (req, res) => {
    try {
        const eventCounts = await eventService.getEventsHostedByUsername(req.params.username);
        res.status(200).json(eventCounts);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /api/Event/getAllPendingEvents:
 *   get:
 *     summary: Retrieves all pending events
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all pending events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PendingEvent'
 *       500:
 *         description: Internal Server Error
 */
router.get("/getAllPendingEvents", [auth, user], async (req, res) => {
    try {
        const pendingEvents = await pendingEventService.getAllPendingEvents();
        res.status(200).json(pendingEvents);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});





module.exports = router;
