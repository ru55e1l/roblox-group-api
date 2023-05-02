const express = require('express');
const router = express.Router();
const userService = require('../services/user-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing Users
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Returns a user by name
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
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
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/', [auth, user], async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.query.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Signup as a user
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *                      description:
 *                          type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/signup', async (req, res) => {
    try {
        // Call the userService to create a new user
        const user = await userService.createUser({
            username: req.body.username.trim(),
            password: req.body.password,
            description: req.body.description
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: login as a user
 *     tags: [User]
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', async (req, res) => {
    try {
        const user = await userService.authenticateUser(req.body.username, req.body.password);

        // Get the device identifier (User-Agent header in this case)
        const device = req.headers['user-agent'] || 'unknown';

        // Create a refresh token for the specific device
        const refreshToken = await userService.createRefreshToken(user._id, device);

        // Set the cookies
        res.cookie('userId', user._id, {
            signed: true,
            httpOnly: true,
            maxAge: process.env.TRAINER_LIFE,
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            maxAge: process.env.REFRESH_LIFE,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



/**
 * @swagger
 * /api/user/refresh:
 *   post:
 *     summary: Refresh the authentication cookie
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed
 *       401:
 *         description: Unauthorized, no refresh token provided or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No refresh token provided
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/refresh', async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const refreshTokenDoc = await userService.validateRefreshToken(oldRefreshToken);
        const userId = refreshTokenDoc.userId;

        // Delete the old refresh token
        await userService.deleteRefreshToken(oldRefreshToken);

        // Get the device identifier (User-Agent header in this case)
        const device = req.headers['user-agent'] || 'unknown';

        // Create a new refresh token for the specific device
        const newRefreshToken = await userService.createRefreshToken(userId, device);

        res.cookie('userId', userId, {
            signed: true,
            httpOnly: true,
            maxAge: process.env.TRAINER_LIFE,
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('refreshToken', newRefreshToken.token, {
            httpOnly: true,
            maxAge: process.env.REFRESH_LIFE,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout a user and clear their cookies
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */
router.post('/logout', async (req, res) => {
    try {
        const userId = req.signedCookies.userId;
        if (userId) {
            await userService.deleteRefreshTokenByUserId(userId);
        }

        res.clearCookie('userId');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
