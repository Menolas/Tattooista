const userService = require('../services/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../exeptions/apiErrors');
const generateFileRandomName = require("../utils/functions");

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
      console.log(JSON.stringify(userData) + " user data");
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

      if (req.files && req.files.avatar) {
        const file = req.files.avatar;
        if (!file) return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await file.mv(`./uploads/users/${userData.user._id}/avatar/${newFileName}`, e => {
          if (e) console.log(e);
        })
        userData.user.avatar = newFileName;
      }

      await userData.user.save();
      await userData.user.populate("roles");
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
      return res.status(400).json({ message: "Server error" });
    }
  }

  async activate(req, res) {
    try {
      const activationLink = req.params.link;
      const token = await userService.activate(activationLink);
      return res.redirect(`${process.env.CLIENT_URL}/email-confirmation?token=${token}`);
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: "Server error" });
    }
  }

  async verifyEmail(req, res) {
    const results = {};
    try {
      const {token} = req.body;
      const user = await userService.verifyEmail(token);
      console.log(JSON.stringify(user) + " verufyEmail user data!!!!!!");
      const userData = await userService.login(user.email, user.password, true);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true });
      results.resultCode = 0;
      results.userData = userData;
      return res.json(results);
    } catch(e) {
      console.log(e);
      return res.status(400).json({ message: "Server error" });
    }
  }

  async refresh(req, res) {
    const results = {};
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
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
      return res.status(400).json({ message: "Server error" });
    }
  }
}

module.exports = new AuthController();
