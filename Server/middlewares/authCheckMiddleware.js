const tokenService = require('../services/tokenService');

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
        const data = tokenService.validateAccessToken(token);
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
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (userData.id === id && tokenFromDb) {
          console.log(isRightUser + " we have right refresh token apparently...");
          isRightUser = true;
        } else {
          return res.status(401).json({ message: "Failed to validate refresh token" });
        }
      }

      req.isRightUser = isRightUser;
      console.log(req.isRightUser + " is user right in the end of the end");
      next();

    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Server Error" });
    }
  }
}
