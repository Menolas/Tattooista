const FaqItem = require('../models/FaqItem');
const FaqService = require('../services/faqService');

class faqController {

  async getFaqItems(req, res) {
    const results = {};
    try {
      results.resultCode = 0;
      results.faqItems = await FaqItem.find();
      res.json(results);
    } catch (e) {
      console.log(e);
    }
  }

  async addFaqItem(req, res) {
    const results = {};

    try {
      const faqItem = await FaqService.addFaqItem(req.body);
      results.resultCode = 0;
      results.faqItem = await faqItem.save();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async updateFaqItem(req, res) {
    const results = {};

    try {
      const isFaqUnique = await FaqService.editFaqItem(
          res.faqItem._id,
          req.body
      );
      if (isFaqUnique) {
        res.faqItem.question = req.body.question;
        res.faqItem.answer = req.body.answer;
      }
      results.resultCode = 0;
      results.faqItem = await res.faqItem.save();
      res.status(201).json(results);
    } catch (e) {
      console.log(e);
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteFaqItem(req, res) {
    const results = {};

    try {
      await res.faqItem.remove();
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }
}

module.exports = new faqController();
