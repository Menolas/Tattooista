const jwt = require("jsonwebtoken");
const userService = require('../services/userService');
const Role = require("../models/Role");

module.exports = function (roles) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
      return;
    }

    let token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') {
      console.log("auth no token !!!!!!!!!!!");
      req.hasRole = false;
      next();
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
        if (err) {
          console.log(err + "jwt error !!!!!!!!!!!");
          const results = {};
          results.resultCode = 1;
          results.message = err.message;
          res.status(401).json(results);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const { exp } = decoded; // Expiration time of the token
        const expirationThreshold = 60 * 5; // Threshold: 5 minutes
        const timeToExpire = exp - currentTime;

        if (timeToExpire < expirationThreshold) {
          const {refreshToken} = req.cookies;
          const userData = await userService.refresh(refreshToken);
          if (userData) {
            console.log("jwt refreshing !!!!!!!!!!!")
            req.userData = userData;
          } else {
            console.log("Failed to refresh access token !!!!!!!!!!!")
            res.status(401).json({ message: "Failed to refresh access token" });
            return;
          }
        }
        const userRoles = decoded?.roles;
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
      });

    } catch (e) {
      console.log(e);
      req.hasRole = false;
      next();
    }
  }
}
