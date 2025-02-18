const Router = require('express');
const router = new Router();
const Review = require('../models/Review');
const controller = require('../controllers/reviewsController');
const authCheckMiddleware = require("../middlewares/authCheckMiddleware");

function dynamicAuthCheckMiddleware() {
  return (req, res, next) => {
    const userId = req.params.id;
    if(userId !== null) {
      console.log(req.params.id + " here is the id from userRoutes");
      const middleware = authCheckMiddleware(userId);
      middleware(req, res, next);
    } else {
      return res.status(404).json({ message: 'Cannot find user' });
    }

  };
}

//getting all reviews
router.get('/', controller.getReviews);

// add review
router.post('/:id', dynamicAuthCheckMiddleware(), controller.addReview);

// update service
//router.post('/:id',  getReview, controller.updateService);

// delete service
//router.delete('/:id', getReview, controller.deleteService);

async function getReview(req, res, next) {
  let review;

  try {
    review = await Review.findById(req.params.id);
    if (review == null) {
      return res.status(404).json({ message: 'Cannot find review' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.service = review;
  next();
}

module.exports = router;
