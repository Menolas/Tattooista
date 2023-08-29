require('dotenv').config()
const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('../config')


const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }

  // return = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })

  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {

  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration Error", errors })
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username })
      if (candidate) {
        return res.status(400).json({message: 'User with such name already exist'})
      }
      const hashPassword = bcrypt.hashSync(password, 7)
      //const userRole = await Role.findOne({ value: 'USER' })
      const user = new User({
        username,
        password: hashPassword
        //roles: [userRole.value]
      })
      await user.save();
      return res.json(user)
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Registration error' })
    }
  }

  async login(req, res) {
    try {
      const results = {}
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        results.resultCode = 1
        results.error = 'Nice try'
        return res.status(400).json(results)
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        results.resultCode = 1
        results.error = 'Nice try'
        return res.status(400).json(results)
      }
      const token = generateAccessToken(user._id, user.roles)
      user.token = token

      const updatedUser = await user.save()
      results.resultCode = 0
      results.user = updatedUser
      res.json(results)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async authenticateUser(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const user = await User.findOne({token})
      let result = 1
      if (user) {
        result = 0
        res.json(result)
      }
    } catch (e) {
      console.log(e)
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (e) {
      console.log(e)
    }
  }

  async logout(req, res) {
    res.user.token = null
    try {
      await res.user.save()
      const result = 0
      res.json(result)
    } catch (e) {
      const result = 1
      res.json(result)
      console.log(e)
    }
  }
}

module.exports = new authController();

/* const userRole = new Role();
const adminRole = new Role({ value: "ADMIN" });
await userRole.save();
await adminRole.save(); */
