const Router = require('express').Router
const authController = require('../controllers/authController')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
//const roleMiddleware = require('../middlewares/roleMiddleware')
//const User = require('../models/User')
const router = new Router()

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min:4, max:32}),
  authController.registration
)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.activate)
router.get('/refresh', authController.refresh)
router.get('/users', authMiddleware, authController.getUsers)

// async function getUser(req, res, next) {
//   let user
//   try {
//     user = await User.findById(req.params.id)
//     if (user === null) {
//       return res.status(404).json({ message: 'Cannot find user' })
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message })
//   }
//
//   res.user = user
//   next()
// }

module.exports = router
