const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyUser = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return renewToken(req, res, next);
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            if (err.message === 'jwt expired') {
                return res.status(401).json({ message: 'JWT expired' });
            } else if (err.message === 'jwt malformed') {
                res.clearCookie('accessToken');
                console.log('JWT malformed');
                return res.status(400).json({ message: 'Token malformed' });
            } else {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }
        } else {
            req.id = decoded.id;
            next();
        }
    });
};

const renewToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ message: 'Invalid refresh token' });
        } else {
            const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1m' });
            res.cookie('accessToken', newAccessToken, { maxAge: 60000 });
            req.id = decoded.id;
            next();
        }
    });
};
// rateLimiter.js
const rateLimit = require('express-rate-limit');

// Define the rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});



module.exports = { verifyUser, renewToken, limiter };
