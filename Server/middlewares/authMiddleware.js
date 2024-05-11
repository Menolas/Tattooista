const jwt = require("jsonwebtoken");
//const { refreshTokens } = require("../utils/auth"); // Import the function to refresh tokens

module.exports = function () {
  return async function (req, res, next) {

    if (req.method === "OPTIONS") {
      console.log("hit authMiddleware!!!");
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log(req.headers.authorization + " token!!!!!!!!!!!")
    if (!token || token === 'null') {
      console.log("hit authMiddleware no token!!!");
      req.hasRole = false;
      next();
      return;
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err)
        req.hasRole = false;
        next();
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const { exp } = decoded; // Expiration time of the token
      const expirationThreshold = 60 * 5; // Threshold: 5 minutes
      const timeToExpire = exp - currentTime;

      if (timeToExpire < expirationThreshold) {
        const refreshedTokens = ''//await refreshTokens(token); // Call the function to refresh tokens
        if (refreshedTokens) {
          res.setHeader('Authorization', `Bearer ${refreshedTokens.accessToken}`);
        } else {
          res.status(401).json({ message: "Failed to refresh access token" });
          return;
        }
      }
      next();
    });
  }
}
