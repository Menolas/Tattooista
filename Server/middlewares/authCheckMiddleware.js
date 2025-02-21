const tokenService = require('../services/tokenService');
const jwt = require("jsonwebtoken");

module.exports = function (id) {
  return async function (req, res, next) {

    if (req.method === "OPTIONS") {
      req.isRightUser = false;
      next();
      return;
    }

    let isRightUser = false;
    let token = req.headers.authorization
        ? req.headers.authorization?.split(' ')[1]
        :  null;

    try {
      if(token) {
        console.log(token + " token from authCheckMiddleware");
        const data = tokenService.validateAccessToken(token);
        console.log(data + " data from authCheckMiddleware");
        if (data && data.id === id) {
          isRightUser = true;
        } else {
          token = null;
        }
      }

      if (!token || token === 'null') {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
          return res.status(401).json({ message: "Access denied, no valid tokens found" });
        }

        const userData = await tokenService.validateRefreshToken(refreshToken);
        console.log(JSON.stringify(userData) + " userData from validateRefreshToken authCheckMiddleware");
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (userData.id === id && tokenFromDb) {
          isRightUser = true;
          console.log(isRightUser + " we have right refresh token apparently...");
        } else {
          return res.status(401).json({ message: "Failed to validate refresh token in authCheckMiddleWare" });
        }
      }

      req.isRightUser = isRightUser;
      next();

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Server Error - authCheckMiddleware" });
    }
  }
}
