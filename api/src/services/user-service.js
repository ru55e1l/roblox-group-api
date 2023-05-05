const User = require('../models/user');
const RefreshToken = require('../models/refreshToken')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const GenericService = require('./generic-service');

class UserService extends GenericService {
    constructor() {
        super(User);
    }

    async createUser(userData) {
        // Check if a user with the same username or email already exists
        const existingUser = await this.getDocumentByField({
            $or: [
                { username: userData.username },
            ],
        });
        if (existingUser) {
            throw new Error('A user with the same username or email already exists.');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create a new User instance with the hashed password and converted birthday
        const user = await this.createDocument({
            username: userData.username,
            password: hashedPassword,
            description: userData.description,
        });

        return user;
    }

    async authenticateUser(username, password) {
        // Find the user by their username
        const user = await this.getDocumentByField({ username });
        if (!user) {
            throw new Error('Invalid username or password');
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid username or password');
        }

        // Generate a JWT token with the user's ID and roles
        return user;

    }
    async getUserByUsername(username) {
        try {
            const user = await this.getDocumentByField({ 'username': username });
            if (!user) {
                throw new Error(`User with username ${username} not found`);
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createRefreshToken(userId, device) {
        // Delete existing refresh tokens for the same userId and device
        await RefreshToken.deleteMany({ userId, device });

        // Create a new refresh token
        const expiresIn = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        const token = crypto.randomBytes(32).toString('hex');

        const refreshToken = new RefreshToken({
            token,
            userId,
            device,
            expiresAt: expiresIn
        });

        await refreshToken.save();
        return refreshToken;
    }


    async validateRefreshToken(token) {
        const refreshToken = await RefreshToken.findOne({ token });
        if (!refreshToken) {
            throw new Error('Invalid refresh token');
        }
        return refreshToken;
    }

    async deleteRefreshToken(token) {
        await RefreshToken.deleteOne({ token });
    }

    async deleteRefreshTokenByUserId(userId) {
        await RefreshToken.deleteMany({ userId });
    }



}


module.exports = new UserService();
