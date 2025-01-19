const tokenService = require('../services/tokenService');
const Role = require("../models/Role");
const {decode} = require("jsonwebtoken");

module.exports = function (roles) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      req.hasRole = false;
      next();
      return;
    }

    let token = req.headers.authorization
        ? req.headers.authorization?.split(' ')[1]
        :  null;

    const roleObjectPromises = roles.map(async role => {
      const roleObject = await Role.findOne({ value: role });
      return roleObject._id;
    });
    const roleIds = await Promise.all(roleObjectPromises);
    let hasRole = false;
    let userRoles = [];

    try {
      if(token) {
        //const decoded = decode(token, { complete: true });
        //console.log('Decoded Token:', decoded);
        const data = tokenService.validateAccessToken(token);
        const { accessToken } = tokenService.generateTokens({ email: 'olenakunina@gmail.com', id: 'test' });
        console.log('Generated Token:', accessToken);
        console.log('Received Token:', token);
        console.log('Tokens Match:', accessToken === token);
        //console.log(JSON.stringify(data) + " user roles from roleCheckMiddleware")
        if (data) {
          userRoles = data.roles;
          console.log(userRoles + " user roles from roleCheckMiddleware")
        } else {
          token = null;
        }
      }

      if (!token || token === 'null') {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
          req.hasRole = false;
          return res.status(401).json({ message: "Access denied, no valid tokens found" });
        }

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (userData && tokenFromDb) {
          userRoles = userData.roles;
        } else {
          return res.status(401).json({ message: "Failed to validate refresh token" });
        }
      }

      userRoles?.forEach(role => {
        roleIds.forEach(roleId => {
          if (roleId.toString() === role) {
            hasRole = true;
          }
        });
      });
      req.hasRole = hasRole;
      next();

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Server Error" });
    }
  }
}
