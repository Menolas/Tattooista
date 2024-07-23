const GalleryItem = require('../models/GalleryItem');
const ArchivedGalleryItem = require('../models/ArchivedGalleryItem');
const TattooStyle = require('../models/TattooStyle');
const fs = require('fs');
const mv = require('mv');
const generateFileRandomNameWithDate =require('../utils/functions');

class galleryController {

  async getGalleryItems(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let gallery = [];
    const results = {};
    try {
      const style = await TattooStyle.findOne({_id: req.query.style});
      const styleId = style._id;
      if (style.nonStyle) {
        gallery = await GalleryItem.find( {$or: [{ tattooStyles: { $exists: true, $size: 0 } }, { tattooStyles:req.query.style }]}).sort({ createdAt: -1 });
      } else {
          gallery = await GalleryItem.find({tattooStyles: styleId}).sort({ createdAt: -1 });
      }

      results.resultCode = 0;
      results.totalCount = gallery.length;
      results.gallery = gallery.slice(startIndex, endIndex);
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
      console.log(e);
    }
  }

  async updateGalleryItem(req, res) {
    const results = {};
    const styles = req.body.values;
    res.galleryItem.tattooStyles = [];

    try {
      for (let key in styles) {
        if (styles[key]) {
          const style = await TattooStyle.findOne({_id: key});
          const styleId = style._id;
          res.galleryItem.tattooStyles.push(styleId);
        }
      }
      results.galleryItem = await res.galleryItem.save();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async updateArchivedGalleryItem(req, res) {
    const results = {};
    const styles = req.body.values;
    res.archivedGalleryItem.tattooStyles = [];
    for (let key in styles) {
      if (styles[key]) {
        const style = await TattooStyle.findOne({_id: key});
        const styleId = style._id;
        res.archivedGalleryItem.tattooStyles.push(styleId);
      }
    }

    try {
      results.archivedGalleryItem = await res.archivedGalleryItem.save();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async getArchivedGalleryItems(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let gallery = [];
    const results = {};

    try {
      gallery = await ArchivedGalleryItem.find().sort({createdAt: -1})
      results.resultCode = 0;
      results.totalCount = gallery.length;
      results.gallery = gallery.slice(startIndex, endIndex);
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
      console.log(e);;
    }
  }

  async deleteGalleryItem(req, res) {
    const results = {};
    try {
      await fs.unlink(`./uploads/gallery/${res.galleryItem.fileName}`, e => {
        if (e) {
          console.log(e);
        }
      });
      await res.galleryItem.remove();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async addGalleryItems(req, res) {
    const style = await TattooStyle.findOne({_id: req.params.style});
    const styleId = style._id;
    const files = req.files;
    let gallery = [];
    const results = {};

    try {
      for (let key in files) {
        const fileNewName = generateFileRandomNameWithDate(files[key].name);
        gallery.push(fileNewName);

        try {
          await files[key].mv(`./uploads/gallery/${fileNewName}`);
        } catch (error) {
          console.error('An error occurred during file move:', error);
          throw error; // Propagate the error upwards
        }
      }

      let updatedGallery = await Promise.all(gallery.map(
        async (item) => {
          const newGalleryItem = new GalleryItem({
            fileName: item.toString(),
            tattooStyles: [styleId],
          });
          await newGalleryItem.save();
          return newGalleryItem;
      }));
      results.resultCode = 0;
      results.gallery = updatedGallery;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async archiveGalleryItem(req, res) {
    const results = {};

    try {
      const styles = res.galleryItem.tattooStyles;
      styles.map( async (style) => {
        const trueStyle = await TattooStyle.findOne({_id: style});
        if (trueStyle) return trueStyle._id;
        else return null;
      }).filter(style => style !== null);
      const archivedGalleryItem = new ArchivedGalleryItem({
        fileName: res.galleryItem.fileName,
        tattooStyles: styles,
      });
      const oldPath = `./uploads/gallery/${res.galleryItem.fileName}`;
      const newPath = `./uploads/archivedGallery/${res.galleryItem.fileName}`;

      mv(oldPath, newPath, { mkdirp: true },function (e) {
        if (e) console.log(e);
      });
      await archivedGalleryItem.save();
      await res.galleryItem.remove();
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async reactivateGalleryItem(req, res) {
    const results = {};
    try {
      const styles = res.archivedGalleryItem.tattooStyles;
      styles.map( async (style) => {
        const trueStyle = await TattooStyle.findOne({_id: style});
        if (trueStyle) return trueStyle._id;
        else return null;
      }).filter(style => style !== null);
      const galleryItem = new GalleryItem({
        fileName: res.archivedGalleryItem.fileName,
        tattooStyles: styles,
      });

      const oldPath = `./uploads/archivedGallery/${res.archivedGalleryItem.fileName}`;
      const newPath = `./uploads/gallery/${res.archivedGalleryItem.fileName}`;

      mv(oldPath, newPath, { mkdirp: true },function (e) {
        if (e) console.log(e);
      })
      await galleryItem.save();
      await res.archivedGalleryItem.remove();
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteArchivedGalleryItem(req, res) {
    const results = {};

    try {
      await fs.unlink(`./uploads/archivedGallery/${res.archivedGalleryItem.fileName}`, e => {
        if (e) {
          res.status(400).send(e);
        }
      });
      await res.archivedGalleryItem.remove();
      results.resultCode = 0
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }
}

module.exports = new galleryController();
