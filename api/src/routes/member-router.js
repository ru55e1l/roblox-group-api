const express = require('express');
const router = express.Router();
const memberService = require('../services/member-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");
const ccrService = require('../services/ccr-service');

/**
 * @swagger
 * tags:
 *   name: Member
 *   description: API for managing Members
 */

/**
 * @swagger
 * /api/member:
 *   post:
 *     summary: Create a new member
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Member data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: Member already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/', async (req, res) => {
    try {
        const memberData = req.body;
        const member = await memberService.createMember(memberData);
        res.status(201).json(member);
    } catch (error) {
        if (error.message.includes('already in system')) {
            return res.status(409).json({ message: error.message });
        }
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/member/update-headshot-urls:
 *   post:
 *     summary: Update headshot URLs for all members
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Headshot URLs updated successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/update-headshot-urls', auth, admin, async (req, res) => {
    try {
        await memberService.updateHeadshotUrls();
        res.status(200).json({ message: 'All documents updated with headshotUrl' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/member/update-infamy:
 *   put:
 *     summary: Update infamy based on username
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: JSON data with rank, username, and infamy
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 rank:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 infamy:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Infamy updated successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
router.put('/update-infamy', auth, admin, async (req, res) => {
    try {
        const membersData = req.body;
        await memberService.updateInfamyByUsername(membersData);
        res.status(200).json({ message: 'Infamy updated successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/member/getCCRHistory/{username}:
 *   get:
 *     summary: Get CCR history for a member by username
 *     tags: [Member]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the member to get CCR history for
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
 *                 evidence:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                       description:
 *                         type: string
 *                       evidence:
 *                         type: string
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userid:
 *                         type: string
 *                       username:
 *                         type: string
 *       404:
 *         description: Member not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getCCRHistory/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const evidence = await ccrService.GetHistory(username);
        res.status(200).json({evidence});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
