const Router = require("express");
const router = new Router();
const controller = require("../controllers/usersController");
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');
const User = require("../models/User");

//getting roles
router.get('/roles', controller.getRoles);

//Getting users
router.get('/', authRoleMiddleware(["SUPERADMIN"]), controller.getUsers);
//router.get('/users', authMiddleware, authController.getUsers)

// delete user
router.delete('/:id', authRoleMiddleware(["SUPERADMIN"]), getUser, controller.deleteUser);

//update user
router.post('/edit/:id', authRoleMiddleware(["SUPERADMIN"]), getUser, controller.updateUser);

//creating user
router.post('/', authRoleMiddleware(["SUPERADMIN"]), controller.addUser);

//getting one user

router.get('/:id', authRoleMiddleware(["USER"]), getUser, controller.getUser);

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;
