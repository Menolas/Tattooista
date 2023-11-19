const express = require('express')
const Router = require('express')
const router = new Router()
const GalleryItem = require('../models/GalleryItem')
const ArchivedGalleryItem = require('../models/ArchivedGalleryItem')
const controller = require('../controllers/galleryController')

//getting all gallery items
router.get('/', controller.getGalleryItems)

//updating gallery item

router.patch('/updateGalleryItem/:id', getGalleryItem, controller.updateGalleryItem)

// getting all archived gallery items

router.get('/archive/', controller.getArchivedGalleryItems)

//adding gallery items
router.post('/:style', controller.addGalleryItems)

// Deleting one gallery item
router.delete('/:id', getGalleryItem, controller.deleteGalleryItem)

// delete archived gallery item

router.delete('/archive/:id', getArchivedGalleryItem, controller.deleteArchivedGalleryItem)

// archiving gallery item

router.post('/archive/:id', getGalleryItem, controller.archiveGalleryItem)

// reactivating gallery item

router.get('/reactivate/:id', getArchivedGalleryItem, controller.reactivateGalleryItem)

async function getGalleryItem(req, res, next) {
  let galleryItem
  try {
    galleryItem = await GalleryItem.findById(req.params.id)
    if (galleryItem == null) {
      return res.status(404).json({ message: 'Cannot find galleryItem' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.galleryItem = galleryItem
  next();
}

async function getArchivedGalleryItem(req, res, next) {
  let archivedGalleryItem
  try {
    archivedGalleryItem = await ArchivedGalleryItem.findById(req.params.id)
    if (archivedGalleryItem == null) {
      return res.status(404).json({ message: 'Cannot find galleryItem' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.archivedGalleryItem = archivedGalleryItem
  next();
}

module.exports = router
