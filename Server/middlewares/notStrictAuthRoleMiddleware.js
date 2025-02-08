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

    let hasRole = false;
    let userRoles = [];
    const roleObjectPromises = roles.map(async role => {
      const roleObject = await Role.findOne({ value: role });
      return roleObject._id;
    });
    const roleIds = await Promise.all(roleObjectPromises);
    let token = req.headers.authorization
        ? req.headers.authorization?.split(' ')[1]
        :  null;
    const decoded = decode(token, { complete: true });
    console.log('Decoded Token:', decoded);

    try {
      if(token) {
        console.log(tokenService.validateAccessToken(token) + " data from notStrictAuthRoleMiddleware");
        const data = tokenService.validateAccessToken(token);
        if (data) {
          userRoles = data.roles;
        } else {
          token = null;
        }
      }

      if (!token || token === 'null') {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
          req.hasRole = false;
          next();
          return;
        }

        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (userData && tokenFromDb) {
          userRoles = userData.roles;
        } else {
          return res.status(401).json({ message: "Failed to validate refresh token in noStrictAuthRoleCheck" });
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
