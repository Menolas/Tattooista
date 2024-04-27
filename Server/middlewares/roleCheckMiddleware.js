const jwt = require("jsonwebtoken");
const Role = require("../models/Role");

module.exports = function (roles) {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
            return;
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            console.log(token + " token!!!!!!!!!!!!!")
            if (!token) {
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

                const userRoles = decoded?.roles;
                const roleObjectPromises = roles.map(async role => {
                    const roleObject = await Role.findOne({ value: role });
                    return roleObject._id;
                });

                const roleIds = await Promise.all(roleObjectPromises)
                let hasRole = false;

                userRoles?.forEach(role => {
                    roleIds.forEach(roleId => {
                        if (roleId.toString() === role) {
                            hasRole = true;
                        }
                    })
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
