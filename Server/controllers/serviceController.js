const Service = require("../models/Service");
const fs = require('fs').promises;
const path = require("path");
const generateFileRandomName = require("../utils/functions");
const ServiceService = require("../services/serviceService");

class serviceController {

  async getServices(req, res) {
    const results = {};
    try {
      results.resultCode = 0;
      results.services = await Service.find();
      res.json(results);
    } catch (e) {
      console.log(e);
    }
  }

  async updateService(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};

    try {
      const updatedService = await ServiceService.editService(res.service, req.body);

      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        if (res.service.wallPaper) {
          const wallpaperDir = `./uploads/serviceWallpapers/${res.service._id}`;
          const wallpaperPath = path.join(wallpaperDir, res.service.wallPaper);
          await fs.access(wallpaperPath)
              .then(async () => {
                // File exists, try to delete it
                await fs.unlink(wallpaperPath).catch(err => {
                  console.log("Failed to delete old wallpaper:", err.message);
                });
              })
              .catch(() => {
                // File does not exist, nothing to delete
                console.log("Old wallpaper file does not exist, skipping deletion.");
              });
        }

        const newFileName = generateFileRandomName(file.name);
        const dirPath = `./uploads/serviceWallpapers/${res.service._id}/`;
        await fs.mkdir(dirPath, { recursive: true });
        await file.mv(`${dirPath}${newFileName}`);
        updatedService.wallPaper = newFileName;
      }
      results.resultCode = 0;
      results.service = await updatedService.save();
      res.status(201).json(results);
    } catch (e) {
      console.log(e);
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async addService(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }
    const results = {};
    try {
      const service = await ServiceService.addService(req.body);
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        const dirPath = `./uploads/serviceWallpapers/${service._id}/`;
        const fs = require('fs');
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        await file.mv(`${dirPath}${newFileName}`);
        service.wallPaper = newFileName;
      }
      results.service = await service.save();
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteService(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};

    try {
      // If service has a wallpaper, attempt to delete it
      if (res.service.wallPaper) {
        const wallpaperDir = `./uploads/serviceWallpapers/${res.service._id}`;
        const wallpaperPath = path.join(wallpaperDir, res.service.wallPaper);

        // Try to delete the wallpaper file
        await fs.unlink(wallpaperPath).catch(err => {
          console.log("Failed to delete wallpaper:", err.message);
        });

        // Try to remove the directory (only if it's empty)
        await fs.rmdir(wallpaperDir).catch(err => {
          console.log("Failed to remove directory:", err.message);
        });
      }

      // Always remove the service, regardless of whether the wallpaper exists or not
      await res.service.remove();

      // Fetch and return updated list of services
      const services = await Service.find();
      results.resultCode = 0;
      results.services = services;
      res.status(200).json(results);

    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }
}

module.exports = new serviceController();
