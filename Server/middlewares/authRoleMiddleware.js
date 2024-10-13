const jwt = require("jsonwebtoken");
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const Role = require("../models/Role");

module.exports = function (roles) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
      return;
    }

    let token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') {
      req.hasRole = false;
      next();
      return;
    }

    try {
      const data = tokenService.validateAccessToken(token);

      if (!data) {
        const {refreshToken} = req.cookies;
        const userData = await userService.refresh(refreshToken);
        if (userData) {
          req.userData = userData;
        } else {
          res.status(401).json({ message: "Failed to refresh access token" });
          return;
        }
      }

      const userRoles = data?.roles;
      const roleObjectPromises = roles.map(async role => {
        const roleObject = await Role.findOne({ value: role });
        return roleObject._id;
      });
      const roleIds = await Promise.all(roleObjectPromises);
      let hasRole = false;
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
      req.hasRole = false;
      next();
    }
  }
}
