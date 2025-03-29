const Router = require('express');
const router = new Router();
const Review = require('../models/Review');
const controller = require('../controllers/reviewsController');
const authCheckMiddleware = require("../middlewares/authCheckMiddleware");
const authRoleMiddleware = require("../middlewares/authRoleMiddleware");

function dynamicAuthCheckMiddleware() {
  return (req, res, next) => {
    const userId = req.params.id;
    if(userId !== null) {
      console.log(req.params.id + " here is the id from Reviews Routes dynamicAuthCheckMiddleware");
      const middleware = authCheckMiddleware(userId);
      middleware(req, res, next);
    } else {
      return res.status(404).json({ message: 'Cannot find user' });
    }

  };
}

//getting all reviews
router.get('/', controller.getReviews);

router.get('/:id', controller.getUserReviews);

// add review
router.post('/:id', dynamicAuthCheckMiddleware(), controller.addReview);

// update review
router.post('/reviewUpdate/:id',  authRoleMiddleware(["SUPERADMIN"]), getReview, controller.updateReview);

router.delete('/updateGallery/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getReview, controller.deleteReviewGalleryPicture);

// delete review
router.delete('/:id', authRoleMiddleware(["SUPERADMIN"]), getReview, controller.deleteReview);

async function getReview(req, res, next) {
  let review;

  try {
    review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Cannot find review' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.review = review;
  next();
}

module.exports = router;
