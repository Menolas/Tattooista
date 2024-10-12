const Router = require('express');
const router = new Router();
const TattooStyle = require('../models/TattooStyle');
const controller = require('../controllers/stylesController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');

//getting all tattooStyles
router.get('/', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.getTattooStyles);

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
