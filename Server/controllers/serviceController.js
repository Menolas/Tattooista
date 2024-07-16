const Service = require("../models/Service");
const fs = require("fs");
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
    const results = {};

    try {
      const updatedService = await ServiceService.editService(res.service, req.body);
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await fs.unlink(`./uploads/serviceWallpapers/${updatedService._id}/${updatedService.wallPaper}`, e => {
          if (e) console.log(e);
        })
        await file.mv(`./uploads/serviceWallpapers/${updatedService._id}/${newFileName}`, e => {
          if (e) console.log(e);
        })
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
    const results = {};
    console.log(JSON.stringify(req.body) + "controller service from request")

    try {
      const service = await ServiceService.addService(req.body);
      results.resultCode = 0;
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await file.mv(`./uploads/serviceWallpapers/${service._id}/${newFileName}`, e => {
          service.wallPaper = newFileName;
        });
      }
      results.service = await service.save();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteService(req, res) {
    const results = {};

    try {
      await fs.unlink(`./uploads/serviceWallpapers/${res.service._id}/${res.service.wallPaper}`, e => {
        if (e) console.log(e);
      })
      await fs.rmdir(`./uploads/serviceWallpapers/${res.service._id}`, e => {
        if (e) console.log(e);
      })
      await res.service.remove();

      const services = await Service.find();
      results.resultCode = 0;
      results.services = services;
      res.status(200).json(results);
    } catch (e) {
      results.resultCode = 1
      results.message = e.message;
      res.status(500).json(results);
    }
  }
}

module.exports = new serviceController();
