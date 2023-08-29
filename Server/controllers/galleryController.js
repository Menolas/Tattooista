const GalleryItem = require('../models/GalleryItem')
const ArchivedGalleryItem = require('../models/ArchivedGalleryItem')
const fs = require("fs")
const mv = require("mv");

class galleryController {

  async getGalleryItems(req, res) {
    const style = req.query.style
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let gallery = []
    const results = {}
    try {
      gallery = await GalleryItem.find({categories: style})
      results.resultCode = 0
      results.totalCount = gallery.length
      results.gallery = gallery.slice(startIndex, endIndex)
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
      console.log(e)
    }
  }

  async getArchivedGalleryItems(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let gallery = []
    const results = {}

    try {
      gallery = await ArchivedGalleryItem.find()
      results.resultCode = 0
      results.totalCount = gallery.length
      results.gallery = gallery.slice(startIndex, endIndex)
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
      console.log(e)
    }
  }

  async deleteGalleryItem(req, res) {

    const results = {}
    try {
      await fs.unlink(`./uploads/gallery/${res.galleryItem.fileName}`, err => {
        if (err) {
          return res.status(400).send(err)
        }
      })
      await res.galleryItem.remove()
      results.resultCode = 0
      //results.totalCount = gallery.length
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async addGalleryItems(req, res) {
    if (!req.body.gallery) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      })
    }

    const gallery = []
    const files = req.files
    const results = {}

    for (let key in files) {
      const fileNewName = encodeURI(Date.now() + '_' + files[key].name)
      gallery.push(fileNewName)
      console.log(fileNewName)
      await files[key].mv(`./uploads/gallery/${fileNewName}`, err => {
      })
    }

    try {
      gallery.forEach((item) => {
        const newGalleryItem = new GalleryItem({
          fileName: item.toString(),
          categories: [req.params.style]
        })
        newGalleryItem.save()
      })
      const newGallery = await GalleryItem.find({categories: req.params.style})

      results.resultCode = 0
      results.gallery = newGallery
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async archiveGalleryItem(req, res) {
    const archivedGalleryItem = new ArchivedGalleryItem({
      fileName: res.galleryItem.fileName,
      categories: res.galleryItem.categories
    })

    const oldPath = `./uploads/gallery/${res.galleryItem.fileName}`
    const newPath = `./uploads/archivedGallery/${res.galleryItem.fileName}`

    const results = {}

    try {
      mv(oldPath, newPath, { mkdirp: true },function (err) {
        if (err) console.log(err)
      })
      await archivedGalleryItem.save()
      await res.galleryItem.remove()
      results.resultCode = 0
      results.gallery = await ArchivedGalleryItem.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async reactivateGalleryItem(req, res) {
    const galleryItem = new GalleryItem({
      fileName: res.galleryItem.fileName,
      categories: res.galleryItem.categories
    })

    const results = {}

    try {
      await galleryItem.save()
      await res.galleryItem.remove()
      results.resultCode = 0
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async deleteArchivedGalleryItem(req, res) {

    const results = {}

    try {
      await fs.unlink(`./uploads/archivedGallery/${res.galleryItem.fileName}`, err => {
        if (err) {
          return res.status(400).send(err)
        }
      })
      await res.galleryItem.remove()
      const newGallery = await ArchivedGalleryItem.find()
      results.resultCode = 0
      //results.gallery = newGallery
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

}

module.exports = new galleryController();
