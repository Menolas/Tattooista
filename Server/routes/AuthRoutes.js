const Router = require('express')
const router = new Router()
const User = require('../models/User')
const controller = require('../controllers/authController')
const { check } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/registration', [
  check('username', "Name field can't be blank").notEmpty(),
  check('password', "Password should be more then 4 symbols and less then 10").isLength({min:4, max:10})
], roleMiddleware(['ADMIN']), controller.registration)

router.get('/', authMiddleware(), controller.authenticateUser)

router.post('/login', controller.login)

router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

router.delete('/logout/:id', getUser, controller.logout)

async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user === null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.user = user
  next()
}

module.exports = router
