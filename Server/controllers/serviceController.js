const Service = require('../models/Service');
const fs = require("fs");
//const Page = require("../models/Page");
//const Category = require("../models/Category");

class serviceController {

  async getServices(req, res) {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (e) {
      console.log(e);
    }
  }

  async updateService(req, res) {
    console.log(res.service)
    res.service.title = req.body.title

    const conditions = []
    if (req.body.condition_0 !== "undefined") {
      conditions.push(req.body.condition_0)
    }
    if (req.body.condition_1 !== "undefined") {
      conditions.push(req.body.condition_1)
    }
    if (req.body.condition_2 !== "undefined") {
      conditions.push(req.body.condition_2)
    }
    if (req.body.condition_3 !== "undefined") {
      conditions.push(req.body.condition_3)
    }
    if (req.body.condition_4 !== "undefined") {
      conditions.push(req.body.condition_4)
    }
    if (req.body.condition_5 !== "undefined") {
      conditions.push(req.body.condition_5)
    }

    res.service.conditions = [...conditions]


    const results = {}

    try {
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await fs.unlink(`./uploads/serviceWallpapers/${res.service._id}/${res.service.wallPaper}`, err => {
          if (err) console.log(err)
        })
        await file.mv(`./uploads/serviceWallpapers/${res.service._id}/${newFileName}`, err => {
          res.service.wallPaper = newFileName
          res.service.save()
        })
      }
      await res.service.save()
      results.resultCode = 0
      results.services = await Service.find()
      res.status(201).json(results)
    } catch (e) {
      console.log(e)
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async addService(req, res) {

    const conditions = []
    if (req.body.condition_0 !== "undefined") {
      conditions.push(req.body.condition_0)
    }
    if (req.body.condition_1 !== "undefined") {
      conditions.push(req.body.condition_1)
    }
    if (req.body.condition_2 !== "undefined") {
      conditions.push(req.body.condition_2)
    }
    if (req.body.condition_3 !== "undefined") {
      conditions.push(req.body.condition_3)
    }
    if (req.body.condition_4 !== "undefined") {
      conditions.push(req.body.condition_4)
    }
    if (req.body.condition_5 !== "undefined") {
      conditions.push(req.body.condition_5)
    }

    const service = new Service({
      title: req.body.title,
      conditions: [...conditions]
    })

    const results = {}

    try {
      const newService = await service.save()
      results.resultCode = 0
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await file.mv(`./uploads/serviceWallpapers/${newService._id}/${newFileName}`, err => {
          service.wallPaper = newFileName
          service.save()
        })
      }
      results.services = await Service.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async deleteService(req, res) {
    const results = {}

    try {
      await fs.unlink(`./uploads/serviceWallpapers/${res.service._id}/${res.service.wallPaper}`, err => {
        if (err) console.log(err)
      })
      await fs.rmdir(`./uploads/serviceWallpapers/${res.service._id}`, err => {
        if (err) console.log(err)
      })
      await res.service.remove()

      const services = await Service.find()
      results.resultCode = 0
      results.services = services
      res.status(200).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }
}

module.exports = new serviceController();
