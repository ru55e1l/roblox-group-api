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
router.post('/bulkAddInfamy', async (req, res) => {
    try {
        const { usernames, infamyToAdd } = req.body;
        const result = await infamyService.bulkAddInfamy(usernames, infamyToAdd);
        res.status(200).json(result);
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});





module.exports = router;
