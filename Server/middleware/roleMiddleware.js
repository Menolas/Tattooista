const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token || token === null) {
        return res.status(403).json({ message: "User is not authorized" });
      }

      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "You do not have access" });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(4403).json({ message: "User is not authorized" });
    }
  }
};
