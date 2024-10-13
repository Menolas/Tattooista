const Router = require('express');
const router = new Router();
const Service = require('../models/Service');
const controller = require('../controllers/serviceController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');

//getting all services
router.get('/', controller.getServices);

// add service
router.post('/', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.addService);

// update service
router.post('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getService, controller.updateService);

// delete service
router.delete('/:id', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), getService, controller.deleteService);

async function getService(req, res, next) {
  let service;

  try {
    service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: 'Cannot find service' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.service = service;
  next();
}

module.exports = router;
