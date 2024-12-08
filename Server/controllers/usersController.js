const User = require("../models/User");
const Role = require("../models/Role");
const fs = require("fs");
const generateFileRandomName = require("../utils/functions");
const userService = require('../services/userService');
const uuid = require("uuid");
const mailService = require("../services/mailService");
const bcrypt = require("bcrypt");

class usersController {

    async getRoles(req, res) {
        const results = {};
        try {
            results.resultCode = 0;
            results.roles = await Role.find();
            res.json(results);
        } catch (e) {
            results.resultCode = 1;
            results.message = e.message;
            res.status(400).json(results);
        }
    }

    async getUsers(req, res) {
        if (!req.hasRole) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const role = req.query.role === "any" ? null : req.query.role;
        const term = req.query.term;
        let users = [];
        const results = {};
        try {
            let query = {};
            let searchConditions = [];
            if (term) {
                const regexSearch = { $regex: term, $options: 'i' };
                searchConditions = [
                    { fullName: regexSearch },
                    { email: regexSearch },
                ];
            }
            if (role) {
                const userRole = await Role.findOne({ value: role });
                if (userRole) {
                    query.roles = userRole._id;
                }
            }
            if (searchConditions.length > 0) {
                if (Object.keys(query).length > 0) {
                    query = { $and: [ { $or: searchConditions }, query ] };
                } else {
                    query = { $or: searchConditions };
                }
            }
            users = await User.find(query).sort({ createdAt: -1 });
            results.resultCode = 0;
            results.totalCount = users.length;
            results.users = users.slice(startIndex, endIndex);
            res.status(200).json(results);
        } catch(e) {
            results.resultCode = 1;
            results.message = e.message;
            res.status(400).json(results);
        }
    }

    async deleteUser(req, res) {
        if (!req.hasRole && !req.isRightUser) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        if (req.hasRole || req.isRightUser) {
            const results = {};
            try {
                if (res.user.avatar) {
                    await fs.unlink(`./uploads/users/${res.user._id}/avatar/${res.user.avatar}`, e => {
                        if (e) console.log(e);
                    })
                    await fs.rm(`./uploads/users/${res.user._id}/avatar`, {recursive: true}, e => {
                        if (e) console.log(e);
                    })
                }
                await res.user.remove();
                results.resultCode = 0;
                res.json(results);
            } catch (e) {
                results.resultCode = 1;
                results.message = e.message;
                res.status(500).json(results);
            }
        }
    }

    async updateUser(req, res) {
        if (!req.hasRole && !req.isRightUser) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        if (req.hasRole || req.isRightUser) {
            const displayName = req.body.displayName.trim();
            const email = req.body.email;
            const password = req.body.password;
            const results = {};

            try {
                await userService.editUser(displayName, email, res.user._id);
                const hashPassword = await bcrypt.hash(password, 3);
                if (res.user.email !== email) {
                    res.user.activationLink = uuid.v4();
                    await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/auth/activate/${res.user.activationLink}`);
                    res.user.isActivated = false;
                }
                res.user.displayName = displayName;
                res.user.email = email;
                res.user.password = hashPassword;
                const roleIds = req.body.roles.match(/[a-f\d]{24}/g);
                if (roleIds === "" || roleIds === null) {
                    const userRole = await Role.findOne({value: "USER"});
                    res.user.roles = [userRole._id];
                } else {
                    res.user.roles = roleIds;
                }
                await res.user.populate('roles');
                if (req.files && req.files.avatar) {
                    if (res.user.avatar) {
                        await fs.unlink(`./uploads/users/${res.user._id}/avatar/${res.user.avatar}`, e => {
                            if (e) console.log(e);
                        });
                    }
                    const file = req.files.avatar;
                    const newFileName = generateFileRandomName(file.name);
                    await file.mv(`./uploads/users/${res.user._id}/avatar/${newFileName}`, e => {
                        if (e) console.log(e);
                    });
                    res.user.avatar = newFileName;
                }
                await res.user.populate('roles');
                results.user = await res.user.save();
                results.resultCode = 0;
                res.json(results);
            } catch (e) {
                results.resultCode = 1;
                results.message = e.message;
                res.status(400).json(results);
            }
        }
    }

    async addUser (req, res) {
        if (!req.hasRole) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const results = {};
        try {
            const displayName = req.body.displayName.trim();
            const email = req.body.email;
            const password = req.body.password;
            const roleIds = req.body.roles.match(/[a-f\d]{24}/g);
            await userService.registration(displayName, email, password);
            const user = await User.findOne({displayName});

            if (roleIds === "" || roleIds === null) {
                const userRole = await Role.findOne({value: "USER"});
                user.roles = [userRole._id];
            } else {
                user.roles = roleIds;
            }

            if (req.files && req.files.avatar) {
                const file = req.files.avatar;
                if (!file) return res.json({error: 'Incorrect input name'});
                const newFileName = generateFileRandomName(file.name);
                await file.mv(`./uploads/users/${user._id}/avatar/${newFileName}`, e => {
                    if (e) console.log(e);
                })
                user.avatar = newFileName;
            }

            await user.populate('roles');
            results.resultCode = 0;
            results.user = await user.save();
            return res.json(results);
        } catch (e) {
            results.resultCode = 1;
            results.message = e.message;
            res.status(400).json(results);
        }
    }

    async getUser(req, res) {
        console.log(req.isRightUser + " is user right");
        if (!req.isRightUser) {
            return res.status(403).json({ message: "You don't have permission" });
        }

        const results = {};
        try {
            results.resultCode = 0;
            results.user = res.user;
            res.json(results);
        } catch (e) {
            results.resultCode = 1;
            results.message = e.message;
            res.status(400).json(results);
        }
    }
}

module.exports = new usersController();
