const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1d'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await tokenModel.create({user: userId, refreshToken});
    }

    async removeToken(refreshToken) {
        return tokenModel.deleteOne({refreshToken});
    }

    async findToken(refreshToken) {
        return tokenModel.findOne({refreshToken});
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
