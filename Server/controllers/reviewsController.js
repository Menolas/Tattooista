const Review = require("../models/Review");
const ReviewService = require("../services/reviewService");
const fs = require('fs').promises;
const path = require("path");
const generateFileRandomName = require("../utils/functions");

class reviewsController {

  async getReviews(req, res) {
    const results = {};
    try {
      results.resultCode = 0;
      results.reviews = await Review.find().populate('user', 'displayName avatar');
      res.json(results);
    } catch (e) {
      console.log(e);
    }
  }

  async addReview(req, res) {
    if (!req.isRightUser) {
      return res.status(403).json({ message: "You don't have permission - reviews controller" });
    }
    const results = {};
    try {
      const review = await ReviewService.addReview(req.body, req.params.id);
      console.log(JSON.stringify(req.body + " reviews controller req.body"))

      // if(req.files && req.files.wallPaper) {
      //   const file = req.files.wallPaper;
      //   if(!file)  return res.json({error: 'Incorrect input name'});
      //   const newFileName = generateFileRandomName(file.name);
      //   const dirPath = `./uploads/serviceWallpapers/${service._id}/`;
      //   const fs = require('fs');
      //   if (!fs.existsSync(dirPath)) {
      //     fs.mkdirSync(dirPath, { recursive: true });
      //   }
      //   await file.mv(`${dirPath}${newFileName}`);
      //   service.wallPaper = newFileName;
      // }

      results.review = await ReviewService.addReview(req.body, req.params.id);
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  // async updateReview(req, res) {
  //   if (!req.hasRole) {
  //     return res.status(403).json({ message: "You don't have permission - reviews controller" });
  //   }
  //
  //   const results = {};
  //
  //   try {
  //     const updatedService = await ServiceService.editService(res.service, req.body);
  //
  //     if(req.files && req.files.wallPaper) {
  //       const file = req.files.wallPaper;
  //       if(!file)  return res.json({error: 'Incorrect input name'});
  //       if (res.service.wallPaper) {
  //         const wallpaperDir = `./uploads/serviceWallpapers/${res.service._id}`;
  //         const wallpaperPath = path.join(wallpaperDir, res.service.wallPaper);
  //         await fs.access(wallpaperPath)
  //             .then(async () => {
  //               // File exists, try to delete it
  //               await fs.unlink(wallpaperPath).catch(err => {
  //                 console.log("Failed to delete old wallpaper:", err.message);
  //               });
  //             })
  //             .catch(() => {
  //               // File does not exist, nothing to delete
  //               console.log("Old wallpaper file does not exist, skipping deletion.");
  //             });
  //       }
  //
  //       const newFileName = generateFileRandomName(file.name);
  //       const dirPath = `./uploads/serviceWallpapers/${res.service._id}/`;
  //       await fs.mkdir(dirPath, { recursive: true });
  //       await file.mv(`${dirPath}${newFileName}`);
  //       updatedService.wallPaper = newFileName;
  //     }
  //     results.resultCode = 0;
  //     results.service = await updatedService.save();
  //     res.status(201).json(results);
  //   } catch (e) {
  //     console.log(e);
  //     results.resultCode = 1;
  //     results.message = e.message;
  //     res.status(400).json(results);
  //   }
  // }

  // async deleteReview(req, res) {
  //   if (!req.hasRole) {
  //     return res.status(403).json({ message: "You don't have permission - reviews controller" });
  //   }
  //
  //   const results = {};
  //
  //   try {
  //     // If service has a wallpaper, attempt to delete it
  //     if (res.service.wallPaper) {
  //       const wallpaperDir = `./uploads/serviceWallpapers/${res.service._id}`;
  //       const wallpaperPath = path.join(wallpaperDir, res.service.wallPaper);
  //
  //       // Try to delete the wallpaper file
  //       await fs.unlink(wallpaperPath).catch(err => {
  //         console.log("Failed to delete wallpaper:", err.message);
  //       });
  //
  //       // Try to remove the directory (only if it's empty)
  //       await fs.rmdir(wallpaperDir).catch(err => {
  //         console.log("Failed to remove directory:", err.message);
  //       });
  //     }
  //
  //     // Always remove the service, regardless of whether the wallpaper exists or not
  //     await res.service.remove();
  //
  //     // Fetch and return updated list of services
  //     const services = await Service.find();
  //     results.resultCode = 0;
  //     results.services = services;
  //     res.status(200).json(results);
  //
  //   } catch (e) {
  //     results.resultCode = 1;
  //     results.message = e.message;
  //     res.status(500).json(results);
  //   }
  // }
}

module.exports = new reviewsController();
