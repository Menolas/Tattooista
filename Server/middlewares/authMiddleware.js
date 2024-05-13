const jwt = require("jsonwebtoken");
const userService = require('../services/userService');

module.exports = function () {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
      return;
    }

    let token = req.headers.authorization?.split(' ')[1];
    if (!token || token === 'null') {
      console.log("auth no token !!!!!!!!!!!")
      req.hasRole = false;
      next();
      return;
    }

    try {
      const results = {};
      jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
        if (err) {
          console.log("jwt error !!!!!!!!!!!");
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
            next();
            return;
          } else {
            console.log("Failed to refresh access token !!!!!!!!!!!")
            res.status(401).json({ message: "Failed to refresh access token" });
            return;
          }
        }
        req.token = token;
        console.log("user logged in and token is ok!!!!!!!!!!!!!!!!");
        next();
      });

    } catch (e) {
      console.log(e);
      req.hasRole = false;
      next();
    }
  }
}
