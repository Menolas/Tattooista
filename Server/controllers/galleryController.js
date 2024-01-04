const GalleryItem = require('../models/GalleryItem')
const ArchivedGalleryItem = require('../models/ArchivedGalleryItem')
const TattooStyle = require('../models/TattooStyle')
const fs = require('fs')
const mv = require('mv')
const generateFileRandomNameWithDate =require('../utils/functions')

class galleryController {

  async getGalleryItems(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let gallery = []
    const results = {}
    try {
      const styles = await TattooStyle.find({_id: req.query.style})
      if (styles.length > 0) {
        const style = styles[0]; // Access the first element
        if (style.nonStyle) {
          gallery = await GalleryItem.find( {$or: [{ tattooStyles: { $exists: true, $size: 0 } }, { tattooStyles:req.query.style }]}).sort({ createdAt: -1 });
        } else {
          gallery = await GalleryItem.find({ tattooStyles: req.query.style }).sort({ createdAt: -1 });
        }
      } else {
        //console.log('Style not found');
      }
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

  async updateGalleryItem(req, res) {
    const results = {}
    const styles = req.body.values
    res.galleryItem.tattooStyles = []
    for (let key in styles) {
      if (styles[key]) {
        res.galleryItem.tattooStyles.push(key)
      }
    }

    try {
      results.galleryItem = await res.galleryItem.save()
      results.resultCode = 0
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async updateArchivedGalleryItem(req, res) {
    const results = {}
    const styles = req.body
    console.log(req.body + 'req body !!!!!!!!!!!!!!!!!!!!!!!!')
    res.archivedGalleryItem.tattooStyles = []
    for (let key in styles) {
      if (styles[key]) {
        res.archivedGalleryItem.tattooStyles.push(key)
      }
    }

    try {
      results.archivedGalleryItem = await res.archivedGalleryItem.save()
      results.resultCode = 0
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
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
    let gallery = []
    const files = req.files
    const results = {}

    try {
      for (let key in files) {
        const fileNewName = generateFileRandomNameWithDate(files[key].name)
        gallery.push(fileNewName)
        await files[key].mv(`./uploads/gallery/${fileNewName}`, e => {
          if (e) console.log(e)
        })
      }
      let updatedGallery = gallery.map((item) => {
        const newGalleryItem = new GalleryItem({
          fileName: item.toString(),
          tattooStyles: [req.params.style]
        })
        newGalleryItem.save()
        return newGalleryItem
      })
      results.resultCode = 0
      results.gallery = updatedGallery
      console.log(updatedGallery)
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
      res.status(201).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async reactivateGalleryItem(req, res) {
    const galleryItem = new GalleryItem({
      fileName: res.archivedGalleryItem.fileName,
      tattooStyles: res.archivedGalleryItem.tattooStyles
    })

    const results = {}

    const oldPath = `./uploads/archivedGallery/${res.archivedGalleryItem.fileName}`
    const newPath = `./uploads/gallery/${res.archivedGalleryItem.fileName}`

    try {
      mv(oldPath, newPath, { mkdirp: true },function (e) {
        if (e) console.log(e)
      })
      await galleryItem.save()
      await res.archivedGalleryItem.remove()
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
      await fs.unlink(`./uploads/archivedGallery/${res.archivedGalleryItem.fileName}`, e => {
        if (e) {
          return res.status(400).send(e)
        }
      })
      await res.archivedGalleryItem.remove()
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
