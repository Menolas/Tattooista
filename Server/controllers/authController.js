const userService = require('../services/userService');
const {validationResult} = require('express-validator');
const ApiError = require('../exeptions/apiErrors');

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
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
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
      results.resultCode = 1;
      results.message = e.message;
      console.log(e);
      res.status(400).json(results);
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
      results.resultCode = 1;
      results.message = e.message;
      console.log(e);
      res.status(400).json(results);
    }
  }

  async activate(req, res) {
    const results = {};
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch(e) {
      results.resultCode = 1;
      results.message = e.message;
      console.log(e);
      res.status(400).json(results);
    }
  }

  async refresh(req, res, next) {
    const results = {};
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      if (userData) {
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
        results.resultCode = 0;
        results.userData = userData;
        return res.json(results);
      }
    } catch(e) {
      results.resultCode = 1;
      results.message = e.message;
      console.log(e);
      res.status(400).json(results);
      //next(e)
    }
  }
}

module.exports = new AuthController();
