const jwt = require("jsonwebtoken");
const Role = require("../models/Role");

module.exports = function (roles) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      // const roleObjectPromises = roles.map(async role => {
      //   const roleObject = await Role.findOne({ value: role });
      //   return roleObject._id;
      // })
      //
      // const roleIds = await Promise.all(roleObjectPromises);
      //
      // const token = req.headers.authorization.split(' ')[1];
      // //const {refreshToken} = req.cookies
      // if (!token) {
      //   return res.status(403).json({ message: "User is not authorized" });
      // }
      //
      // const { roles: userRoles } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      //
      // let hasRole = false;
      // userRoles.forEach(role => {
      //   roleIds.forEach(roleId => {
      //     if (roleId.toString() === role) {
      //       hasRole = true;
      //       console.log(JSON.stringify(roleId) + "  roleId type !!!!!!!!!!!!!!!!!!!!!");
      //     }
      //   })
      // });
      //
      // if (!hasRole) {
      //   return res.status(403).json({ message: "No access for you" });
      // }
      // next();

      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: "User is not authorized" });
      }

      jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
        if (err) {
          const results = {};
          if (err.name === 'TokenExpiredError') {
            results.resultCode = 2;
            results.message = 'Token expired';
          } else {
            results.resultCode = 1;
            results.message = 'Invalid token';
          }
          return res.status(401).json({ results });
        }

        const userRoles = decoded.roles;
        const roleObjectPromises = roles.map(async role => {
          const roleObject = await Role.findOne({ value: role });
          return roleObject._id;
        })

        const roleIds = await Promise.all(roleObjectPromises);

        let hasRole = false;
        userRoles.forEach(role => {
          roleIds.forEach(roleId => {
            if (roleId.toString() === role) {
              hasRole = true;
              console.log(JSON.stringify(roleId) + "  roleId type !!!!!!!!!!!!!!!!!!!!!");
            }
          })
        })
        if (!hasRole) {
          return res.status(403).json({ message: "No access for you" });
        }
        next();
      });

    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "User is not authorized" });
    }
  }
}
