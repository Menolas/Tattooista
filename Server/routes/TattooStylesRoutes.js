const Router = require('express');
const router = new Router();
const TattooStyle = require('../models/TattooStyle');
const controller = require('../controllers/tattooStyleController');
const roleCheckMiddleware = require('../middlewares/roleCheckMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

//getting all tattooStyles

router.get('/', authMiddleware, roleCheckMiddleware(["ADMIN", "SUPERADMIN"]), controller.getTattooStyles); //roleCheckMiddleware(["ADMIN", "SUPERADMIN"]),

// Deleting one
router.delete('/:id', getTattooStyle, controller.deleteTattooStyle);

// Creating category (tattooStyle)

router.post('/', controller.addTattooStyle);

// updating category

router.post('/:id', getTattooStyle, controller.updateTattooStyle);

async function getTattooStyle(req, res, next) {
  let tattooStyle;
  try {
    tattooStyle = await TattooStyle.findById(req.params.id);
    if (tattooStyle == null) {
      return res.status(404).json({ message: 'Cannot find category' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.tattooStyle = tattooStyle;
  next();
}

module.exports = router;

