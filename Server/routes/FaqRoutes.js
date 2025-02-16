const Router = require('express');
const router = new Router();
const FaqItem = require('../models/FaqItem');
const controller = require('../controllers/faqController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');

// getting all items
router.get('/', controller.getFaqItems);

// adding faq item
router.post('/', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.addFaqItem);

// updating faqItem
router.post('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getFaqItem, controller.updateFaqItem);

// deleting faqItem
router.delete('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getFaqItem, controller.deleteFaqItem);

async function getFaqItem(req, res, next) {
    let faqItem;
    try {
        faqItem = await FaqItem.findById(req.params.id);
        if (faqItem == null) {
            return res.status(404).json({ message: 'Cannot find faqItem' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.faqItem = faqItem;
    next();
}

module.exports = router;
