const GalleryItem = require('../models/GalleryItem')
const ArchivedGalleryItem = require('../models/ArchivedGalleryItem')
const fs = require('fs')
const mv = require('mv')
const generateFileRandomNameWithDate =require('../utils/functions')

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
      gallery = await GalleryItem.find({tattooStyles: style}).sort({createdAt: -1})
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
      gallery = await ArchivedGalleryItem.find().sort({createdAt: -1})
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
      await fs.unlink(`./uploads/gallery/${res.galleryItem.fileName}`, e => {
        if (e) {
          console.log(e)
        }
      })
      await res.galleryItem.remove()
      results.resultCode = 0
      //results.totalCount = gallery.length
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async addGalleryItems(req, res) {

    // if (!req.body) {
    //   return res.status(400).send({
    //     message: "Data to update can not be empty!"
    //   })
    // }

    const gallery = []
    const files = req.files
    const results = {}

    for (let key in files) {
      const fileNewName = generateFileRandomNameWithDate(files[key].name)
      gallery.push(fileNewName)
      await files[key].mv(`./uploads/gallery/${fileNewName}`, e => {
        if (e) console.log(e)
      })
    }

    await gallery.forEach((item) => {
      const newGalleryItem = new GalleryItem({
        fileName: item.toString(),
        tattooStyles: [req.params.style]
      })
      newGalleryItem.save()
    })

    try {
      results.resultCode = 0
      results.gallery = await GalleryItem.find({tattooStyles: req.params.style})
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async archiveGalleryItem(req, res) {
    const archivedGalleryItem = new ArchivedGalleryItem({
      fileName: res.galleryItem.fileName,
      tattooStyles: res.galleryItem.tattooStyles
    })

    const oldPath = `./uploads/gallery/${res.galleryItem.fileName}`
    const newPath = `./uploads/archivedGallery/${res.galleryItem.fileName}`

    const results = {}

    try {
      mv(oldPath, newPath, { mkdirp: true },function (e) {
        if (e) console.log(e)
      })
      await archivedGalleryItem.save()
      await res.galleryItem.remove()
      results.resultCode = 0
      results.gallery = await ArchivedGalleryItem.find()
      res.status(201).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async reactivateGalleryItem(req, res) {
    const galleryItem = new GalleryItem({
      fileName: res.galleryItem.fileName,
      tattooStyles: res.galleryItem.tattooStyles
    })

    const results = {}

    try {
      await galleryItem.save()
      await res.galleryItem.remove()
      results.resultCode = 0
      res.status(201).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async deleteArchivedGalleryItem(req, res) {

    const results = {}

    try {
      await fs.unlink(`./uploads/archivedGallery/${res.galleryItem.fileName}`, e => {
        if (e) {
          return res.status(400).send(e)
        }
      })
      await res.galleryItem.remove()
      const newGallery = await ArchivedGalleryItem.find()
      results.resultCode = 0
      //results.gallery = newGallery
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

}

module.exports = new galleryController();
