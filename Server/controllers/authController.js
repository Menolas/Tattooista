const userService = require('../services/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../exeptions/apiErrors');
const generateFileRandomName = require("../utils/functions");
const Role = require("../models/Role");
const User = require("../models/User");

class AuthController {
  async registration(req, res, next) {
    const results = {};
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const { displayName, email, password } = req.body;
      const userData = await userService.registration(displayName, email, password);
      //console.log(JSON.stringify(userData) + " user data registration authController");
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

      if (req.files && req.files.avatar) {
        const file = req.files.avatar;
        if (!file) return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await file.mv(`./uploads/users/${userData.user._id}/avatar/${newFileName}`, e => {
          if (e) console.log(e);
        });
        const user = await User.findOne({_id: userData.user._id});
        user.avatar = newFileName;
        await user.save();
        userData.user.avatar = newFileName;
      }

      results.resultCode = 0;
      results.userData = userData;
      return res.json(results);
    } catch(e) {
      next(e);
    }
  }

  async login(req, res) {
    const results = {};
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
      results.resultCode = 0;
      results.userData = userData;
      return res.json(results);
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: e.message });
    }
  }

  async logout(req, res) {
    const results = {};
    try {
      const {refreshToken} = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      results.resultCode = 0;
      return res.json(results);
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: "Server error on log out" });
    }
  }

  async activate(req, res) {
    try {
      const activationLink = req.params.link;
      const token = await userService.activate(activationLink);
      //console.log(token + " token from authController activate");
      return res.redirect(`${process.env.CLIENT_URL}/email-confirmation?token=${encodeURIComponent(token)}`);
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: "Server error on activate" });
    }
  }

  async verifyEmail(req, res) {
    const results = {};
    try {
      const {token} = req.body;
      const user = await userService.verifyEmail(token);
      console.log(JSON.stringify(user) + " verufyEmail user data from authcontroller !!!!!!");
      const userData = await userService.login(user.email, user.password, true);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
      results.resultCode = 0;
      results.userData = userData;
      console.log("email verified!!!!!!!!!!")
      return res.json(results);
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: "Server error on email verifying" });
    }
  }

  async refresh(req, res) {
    const results = {};
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      console.log(JSON.stringify(userData) + " userData from refresh controller")
      if (userData) {
        if (userData.refreshToken) {
          res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
        }
        results.resultCode = 0;
        results.userData = userData;
        return res.json(results);
      }
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: "Server error on refresh auth" });
    }
  }
}

module.exports = new AuthController();
