const Router = require('express').Router;
const authController = require('../controllers/authController');
const { body } = require('express-validator');
const router = new Router();

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min:4, max:32}),
  authController.registration
);

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/activate/:link', authController.activate);
router.post('/verify-email', authController.verifyEmail);
router.get('/refresh', authController.refresh);

module.exports = router;
