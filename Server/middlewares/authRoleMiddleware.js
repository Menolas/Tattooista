const tokenService = require('../services/tokenService');
const Role = require("../models/Role");

module.exports = function (roles) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      req.hasRole = false;
      next();
      return;
    }

    let token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') {
      req.hasRole = false;
      next();
      return;
    }

    const roleObjectPromises = roles.map(async role => {
      const roleObject = await Role.findOne({ value: role });
      return roleObject._id;
    });
    const roleIds = await Promise.all(roleObjectPromises);
    let hasRole = false;
    let userRoles = [];

    try {
      const data = tokenService.validateAccessToken(token);
      if (data) userRoles = data?.roles;

      if (!data) {
        const {refreshToken} = req.cookies;
        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (userData && tokenFromDb) {
          userRoles = userData.roles;
        } else {
          return res.status(401).json({ message: "Failed to refresh access token" });
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
