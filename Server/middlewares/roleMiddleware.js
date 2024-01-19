const jwt = require('jsonwebtoken')
const Role = require("../models/Role");

module.exports = function (roles) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }

    try {
      const roleObjectPromises = roles.map(async role => {
        const roleObject = await Role.findOne({ value: role })
        return roleObject._id;
      })

      const roleIds = await Promise.all(roleObjectPromises)

      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res.status(403).json({ message: "User is not authorized" })
      }

      const { roles: userRoles } = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      let hasRole = false
      userRoles.forEach(role => {
        if (roleIds.includes(role)) {
          hasRole = true
        }
      })
      if (!hasRole) {
        return res.status(403).json({ message: "You do not have access" })
      }
      next()
    } catch (e) {
      console.log(e)
      return res.status(4403).json({ message: "User is not authorized" })
    }
  }
}
