const User = require("../models/User")

class usersController {

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
            } else if (role === '1' && !term) {
                users = await User.find({roles: "ADMIN"}).sort({createdAt: -1})
            } else if (role === '0' && !term) {
                users = await User.find({roles: {$not: { $elemMatch: { $eq: "ADMIN"}}}}).sort({createdAt: -1})
            } else if (role === 'any' && term) {
                users = await User.find({displayName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
            } else if (role === '1' && term) {
                users = await User.find({roles: "ADMIN", displayName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
            } else if (role === '0' && term) {
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
}

module.exports = new usersController()
