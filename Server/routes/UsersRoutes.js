const Router = require("express");
const router = new Router();
const controller = require("../controllers/usersController");
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const User = require("../models/User");

function dynamicAuthCheckMiddleware() {
    return (req, res, next) => {
        const userId = req.params.id; // Extract `id` dynamically
        const middleware = authCheckMiddleware(userId); // Call the original middleware with `userId`
        middleware(req, res, next); // Execute it as a middleware
    };
}

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

router.get('/:id', dynamicAuthCheckMiddleware(), getUser, controller.getUser);

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
