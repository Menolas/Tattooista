const GalleryItem = require('../models/GalleryItem');
const TattooStyle = require('../models/TattooStyle');
const fs = require("fs");
const generateFileRandomName = require("../utils/functions");
const StyleService = require("../services/styleService");

class stylesController {

  async getTattooStyles (req, res) {
    const results = {};
    try {
      const tattooStyles = await TattooStyle.find().sort({createdAt: -1});
      if (req.hasRole && req.query.isSlider === 'false') {
        results.tattooStyles = tattooStyles;
      } else {
        const filteredStyles = await Promise.all(tattooStyles.map(async style =>  {
          const gallery = await GalleryItem.find({tattooStyles: style._id});
          if (gallery.length > 0) {
            return style;
          } else {
            return null;
          }
        }));
        results.tattooStyles = filteredStyles.filter(style => style !== null);
      }
      if (req.userData) {
        results.userData = req.userData;
      }
      results.resultCode = 0;
      res.status(200).json(results);
    } catch (e) {
      console.error(e);
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }

  async deleteTattooStyle(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};
    try {
      await fs.unlink(`./uploads/styleWallpapers/${res.tattooStyle._id}/${res.tattooStyle.wallPaper}`, err => {
        if (err) console.log(err);
      });
      await fs.rmdir(`./uploads/styleWallpapers/${res.tattooStyle._id}`, { recursive:true },err => {
        if (err) console.log(err);
      });
      const galleryItems = await GalleryItem.find({_id: res.tattooStyle._id});
      await galleryItems.forEach(item => {
        item.tattooStyles.pull({_id: res.tattooStyle._id});
      });
      await res.tattooStyle.remove();

      results.resultCode = 0;
      res.status(200).json(results);
    } catch (err) {
      results.resultCode = 1;
      results.message = err.message;
      res.status(500).json(results);
    }
  }

  async addTattooStyle(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};

    try {
      const newTattooStyle = await StyleService.addStyle(req.body);
      results.resultCode = 0;
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await new Promise((resolve, reject) => {
          file.mv(`./uploads/styleWallpapers/${newTattooStyle._id}/${newFileName}`, err => {
            if (err) {
              reject(err);
            } else {
              newTattooStyle.wallPaper = newFileName;
              resolve();
            }
          });
        });
      }
      results.tattooStyle = await newTattooStyle.save();
      res.status(201).json(results);
    } catch (err) {
      results.resultCode = 1;
      results.message = err.message;
      res.status(400).json(results);
    }
  }

  async updateTattooStyle(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};
    console.log(req.body);

    try {
      const updatedStyle = await StyleService.editStyle(res.tattooStyle, req.body);

      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await fs.unlink(`./uploads/styleWallpapers/${res.tattooStyle._id}/${res.tattooStyle.wallPaper}`, err => {
          if (err) console.log(err);
        })
        await file.mv(`./uploads/styleWallpapers/${res.tattooStyle._id}/${newFileName}`, err => {
          if (err) console.log(err);
        })
        updatedStyle.wallPaper = newFileName;
      }
      results.resultCode = 0;
      results.tattooStyle = await updatedStyle.save();
      res.status(201).json(results);
    } catch (err) {
      console.log(err);
      results.resultCode = 1;
      results.message = err.message;
      res.status(400).json(results);
    }
  }

}

module.exports = new stylesController();
