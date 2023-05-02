const userService = require('../../services/member-service');

module.exports = async (req, res, next) => {
    const userId = req.signedCookies.userId;
    const refreshToken = req.cookies.refreshToken;

    if (!userId && !refreshToken) {
        return res.status(401).send({
            ok: false,
            error: "Access denied. No cookies provided",
        });
    }

    try {
        if (!userId && refreshToken) {
            const refreshTokenDoc = await userService.validateRefreshToken(refreshToken);
            const newUserId = refreshTokenDoc.userId;

            // Get the device identifier (User-Agent header in this case)
            const device = req.headers['user-agent'] || 'unknown';

            // Create a new refresh token for the specific device
            const newRefreshToken = await userService.createRefreshToken(newUserId, device);

            // Set the cookies
            res.cookie('userId', newUserId, {
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

            req.signedCookies.userId = newUserId;
        }

        const user = await userService.getDocumentById(req.signedCookies.userId);
        if (!user) {
            return res.status(401).send({
                ok: false,
                error: "Invalid user ID",
            });
        }
        req.user = user;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Error fetching user",
        });
    }

    next();
};
