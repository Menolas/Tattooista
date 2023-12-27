const Router = require("express")
const router = new Router()
const controller = require("../controllers/usersController")
const roleMiddleware = require('../middlewares/roleMiddleware')

//Getting users
router.get('/', controller.getUsers)
//router.get('/users', authMiddleware, authController.getUsers)

module.exports = router
