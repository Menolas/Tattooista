const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
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
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

}

module.exports = new TokenService();
