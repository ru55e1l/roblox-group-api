const express = require('express');
const router = express.Router();
const memberService = require('../services/member-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");

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



module.exports = router;
