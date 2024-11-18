const Router = require('express');
const router = new Router();
const TattooStyle = require('../models/TattooStyle');
const controller = require('../controllers/stylesController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');
const notStrictAuthRoleMiddleware = require('../middlewares/notStrictAuthRoleMiddleware');

//getting all tattooStyles
router.get('/', notStrictAuthRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.getTattooStyles);

// Deleting one
router.delete('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getTattooStyle, controller.deleteTattooStyle);

// Creating category (tattooStyle)
router.post('/', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.addTattooStyle);

// updating category
router.post('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getTattooStyle, controller.updateTattooStyle);

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
