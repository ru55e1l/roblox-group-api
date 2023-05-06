const express = require('express');
const router = express.Router();
const infamyService = require('../services/infamy-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");

/**
 * @swagger
 * tags:
 *   name: Infamy
 *   description: API for managing Infamy
 */

/**
 * @swagger
 * /api/infamy/bulkAddInfamy:
 *   post:
 *     summary: Add infamy to multiple members
 *     tags: [Infamy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Usernames and infamy to add
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
 *                 description: The usernames of the members to add infamy to
 *               infamyToAdd:
 *                 type: number
 *                 format: decimal
 *                 description: The amount of infamy to add to each member
 *             required:
 *               - usernames
 *               - infamyToAdd
 *     responses:
 *       200:
 *         description: Infamy added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       message:
 *                         type: string
 *               description: Array of error messages for failed infamy additions
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
router.post('/bulkAddInfamy', auth, user, async (req, res) => {
    try {
        const { usernames, infamyToAdd } = req.body;

        if (!Array.isArray(usernames) || usernames.some(username => typeof username !== 'string') || typeof infamyToAdd !== 'number') {
            throw new Error("Invalid input: 'usernames' must be an array of strings and 'infamyToAdd' must be a number.");
        }

        const result = await infamyService.bulkAddInfamy(usernames, infamyToAdd);
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/infamy/bulkRemoveInfamy:
 *   post:
 *     summary: Remove infamy from multiple members
 *     tags: [Infamy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Usernames and infamy to remove
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
 *                 description: The usernames of the members to remove infamy from
 *               infamyToRemove:
 *                 type: number
 *                 format: decimal
 *                 description: The amount of infamy to remove from each member
 *             required:
 *               - usernames
 *               - infamyToRemove
 *     responses:
 *       200:
 *         description: Infamy removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       message:
 *                         type: string
 *               description: Array of error messages for failed infamy removals
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
router.post('/bulkRemoveInfamy', auth, user, async (req, res) => {
    try {
        const { usernames, infamyToRemove } = req.body;

        if (!Array.isArray(usernames) || usernames.some(username => typeof username !== 'string') || typeof infamyToRemove !== 'number') {
            throw new Error("Invalid input: 'usernames' must be an array of strings and 'infamyToRemove' must be a number.");
        }

        const result = await infamyService.bulkRemoveInfamy(usernames, infamyToRemove);
        res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/infamy/getInfamy/{username}:
 *   get:
 *     summary: Get infamy for a member by username
 *     tags: [Infamy]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the member to get infamy for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 infamy:
 *                   type: number
 *                   format: decimal
 *                   description: The infamy for the member
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getInfamy/:username', auth, user, async (req, res) => {
    try {
        const infamy = await infamyService.getInfamyByUsername(req.params.username);
        res.status(200).json({ infamy });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/infamy/top:
 *   get:
 *     summary: Get top 10 members with most infamy
 *     tags: [Infamy]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: integer
 *                     format: int32
 *                     description: The Roblox ID of the member
 *                   infamy:
 *                     type: number
 *                     format: decimal
 *                     description: The infamy of the member
 *       500:
 *         description: Internal Server Error
 */
router.get('/top', auth, user, async (req, res) => {
    try {
        const topInfamy = await infamyService.getTopInfamy();
        res.status(200).json(topInfamy);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
