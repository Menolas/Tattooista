const FaqItem = require('../models/FaqItem');

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
    const faqItem = new FaqItem({
      question: req.body.question.trim(),
      answer: req.body.answer.trim()
    });

    const results = {};

    try {
      await faqItem.save();
      results.resultCode = 0;
      results.faqItems = await FaqItem.find();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async updateFaqItem(req, res) {
    res.faqItem.question = req.body.question.trim();
    res.faqItem.answer = req.body.answer.trim();

    const results = {};

    try {
      await res.faqItem.save();
      results.resultCode = 0;
      results.faqItems = await FaqItem.find();
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
      results.faqItems = await FaqItem.find();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }
}

module.exports = new faqController();
