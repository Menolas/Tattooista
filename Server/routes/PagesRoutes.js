const Router = require('express');
const router = new Router();
const controller = require('../controllers/pagesController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');

//getting all pages
router.get('/about', controller.getAboutPage);

// updating page
router.post('/about', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.updateAboutPage);

// change page visibility
router.patch('/visibility/about', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.changeAboutPageVisibility);

module.exports = router;
