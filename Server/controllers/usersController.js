const User = require("../models/User")
const Role = require("../models/Role")
const fs = require("fs");
const generateFileRandomName = require("../utils/functions")
const userService = require('../services/userService')

class usersController {

    async getRoles(req, res) {

        const results = {}

        try {
            results.resultCode = 0
            results.roles = await Role.find()
            res.json(results)
        } catch (e) {
            results.resultCode = 1
            results.message = e.message
            res.status(400).json(results)
        }
    }

    async getUsers(req, res, next) {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const role = req.query.role
        const term = req.query.term
        let users = []
        const results = {}

        try {
            if (role === 'any' && !term) {
                users = await User.find().sort({createdAt: -1})
            } else if (role === 'true' && !term) {
                users = await User.find({roles: "ADMIN"}).sort({createdAt: -1})
            } else if (role === 'false' && !term) {
                users = await User.find({roles: {$not: { $elemMatch: { $eq: "ADMIN"}}}}).sort({createdAt: -1})
            } else if (role === 'any' && term) {
                users = await User.find({displayName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
            } else if (role === 'true' && term) {
                users = await User.find({roles: "ADMIN", displayName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
            } else if (role === 'false' && term) {
                users = await User.find({roles: {$not: { $elemMatch: { $eq: "ADMIN"}}}, displayName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
            }

            results.resultCode = 0
            results.totalCount = users.length
            results.users = users.slice(startIndex, endIndex)
            res.json(results)
        } catch(e) {
            results.resultCode = 1
            results.message = e.message
            res.status(400).json(results)
            next(e)
        }
    }

    async deleteUser(req, res) {
        const results = {}

        try {
            if (res.user.avatar) {
                await fs.unlink(`./uploads/users/${res.user._id}/avatar/${res.user.avatar}`, e => {
                    if (e) console.log(e)
                })
                await fs.rm(`./uploads/users/${res.user._id}/avatar`, { recursive:true }, e => {
                    if (e) console.log(e)
                })
            }

            await res.user.remove()
            results.resultCode = 0
            res.json(results)
        } catch (e) {
            results.resultCode = 1
            results.message = e.message
            res.status(500).json(results)
        }
    }

    async updateUser(req, res) {
        res.user.displayName = req.body.displayName
        res.user.email = req.body.email
        const roles = req.body.roles
        if (roles === "" || roles === null) {
            res.user.roles = ["USER"]
        } else {
            res.user.roles = roles.split(',')
        }

        if (req.files && req.files.avatar) {
            if (res.user.avatar) {
                await fs.unlink(`./uploads/users/${res.user._id}/avatar/${res.user.avatar}`, e => {
                    if (e) console.log(e)
                })
            }

            const file = req.files.avatar
            const newFileName = generateFileRandomName(file.name)
            await file.mv(`./uploads/users/${res.user._id}/avatar/${newFileName}`, e => {
                if (e) console.log(e)
            })
            res.user.avatar = newFileName
        }

        const results = {}

        try {
            results.user = await res.user.save()
            results.resultCode = 0
            res.json(results)
        } catch (e) {
            results.resultCode = 1
            results.message = e.message
            res.status(400).json(results)
        }
    }

    async addUser (req, res) {
        const results = {}
        try {
            const displayName = req.body.displayName
            const email = req.body.email
            const password = req.body.password
            await userService.registration(displayName, email, password)
            const user = await User.findOne({displayName})

            if (req.files && req.files.avatar) {
                const file = req.files.avatar
                if (!file) return res.json({error: 'Incorrect input name'})
                const newFileName = generateFileRandomName(file.name)
                await file.mv(`./uploads/users/${user._id}/avatar/${newFileName}`, e => {
                    if (e) console.log(e)
                })
                user.avatar = newFileName
                await user.save()
            }

            results.resultCode = 0
            results.user = user
            return res.json(results)
        } catch (e) {
            results.resultCode = 1
            results.message = e.message
            res.status(400).json(results)
        }
    }
}

module.exports = new usersController()
