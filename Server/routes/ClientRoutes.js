const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const ArchivedClient = require('../models/ArchivedClient');
const controller = require('../controllers/clientsController');
const roleMiddleware = require("../middlewares/roleMiddleware");

// Getting all
router.get('/', roleMiddleware(["ADMIN"]), controller.getClients);

// get archived clients
router.get('/archive', controller.getArchivedClients);

// Getting one
router.get('/:id', getClient, controller.getClient);

// Creating one
router.post('/', controller.addClient);

// update client tattoo gallery
router.post('/updateGallery/:id', getClient, controller.updateClientGallery);

// delete picture from client gallery
router.delete('/updateGallery/:id', getClient, controller.deleteClientGalleryPicture);

// delete client
router.delete('/:id', getClient, controller.deleteClient);

// delete archived client
router.delete('/archive/:id', getArchivedClient, controller.deleteArchivedClient);

// edit client

router.post('/edit/:id', getClient, controller.editClient);

// archive client

router.post('/archive/:id', getClient, controller.archiveClient);

// reactivate client from archive

router.get('/archive/:id', getArchivedClient, controller.reactivateClient);

async function getClient(req, res, next) {
  let client;
  try {
    client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.client = client;
  next();
}

async function getArchivedClient(req, res, next) {
  let client;
  try {
    client = await ArchivedClient.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.client = client;
  next();
}

module.exports = router;
