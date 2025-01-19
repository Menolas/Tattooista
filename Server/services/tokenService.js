const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        console.log('Generated Token:', accessToken);
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    generateEmailVerificationToken(payload) {
        return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '5m'});
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshTokens.push(refreshToken);
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshTokens: [refreshToken]});
    }

    async removeToken(refreshToken) {
        return tokenModel.updateOne(
            {refreshTokens: refreshToken},
            {$pull: {refreshTokens: refreshToken}});
    }

    async findToken(refreshToken) {
        return tokenModel.findOne({refreshTokens: refreshToken});
    }

    validateAccessToken(token) {
        try {
            console.log('JWT_ACCESS_SECRET during validation:', process.env.JWT_ACCESS_SECRET);
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            console.error('Access token validation error:', e);
            return null; // Return `null` instead of a string for consistency
        }
    }
    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            console.error('Refresh token validation error:', e);
            return null; // Return `null` instead of a string for consistency
        }
    }

}

module.exports = new TokenService();
