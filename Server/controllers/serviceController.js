const Service = require("../models/Service");
const fs = require("fs");
const generateFileRandomName = require("../utils/functions");

const getConditions = (reqBody) => {
  const conditions = [];
  if (reqBody.condition_0 !== "undefined") conditions.push(reqBody.condition_0.trim());
  if (reqBody.condition_1 !== "undefined") conditions.push(reqBody.condition_1.trim());
  if (reqBody.condition_2 !== "undefined") conditions.push(reqBody.condition_2.trim());
  if (reqBody.condition_3 !== "undefined") conditions.push(reqBody.condition_3.trim());
  if (reqBody.condition_4 !== "undefined") conditions.push(reqBody.condition_4.trim());
  if (reqBody.condition_5 !== "undefined") conditions.push(reqBody.condition_5.trim());

  return conditions;
}

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
    res.service.title = req.body.title.trim();

    const conditions = getConditions(req.body);

    res.service.conditions = [...conditions];

    const results = {};

    try {
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await fs.unlink(`./uploads/serviceWallpapers/${res.service._id}/${res.service.wallPaper}`, e => {
          if (e) console.log(e);
        })
        await file.mv(`./uploads/serviceWallpapers/${res.service._id}/${newFileName}`, e => {
          if (e) console.log(e);
        })
        res.service.wallPaper = newFileName;
      }
      await res.service.save();
      results.resultCode = 0;
      results.services = await Service.find();
      res.status(201).json(results);
    } catch (e) {
      console.log(e);
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async addService(req, res) {

    const conditions = getConditions(req.body);

    const service = new Service({
      title: req.body.title.trim(),
      conditions: [...conditions]
    });

    const results = {};

    try {
      const newService = await service.save();
      results.resultCode = 0;
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await file.mv(`./uploads/serviceWallpapers/${newService._id}/${newFileName}`, e => {
          service.wallPaper = newFileName;
          service.save();
        })
      }
      results.services = await Service.find();
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
