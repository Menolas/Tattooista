const TattooStyle = require('../models/TattooStyle')
const fs = require("fs");

class tattooStyleController {

  async getTattooStyles (req, res) {
    const results = {}
    try {
      results.resultCode = 0
      results.tattooStyles = await TattooStyle.find()
      res.status(200).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(500).json(results)
    }
  }

  async deleteTattooStyle(req, res) {
    const results = {}
    try {
      await fs.unlink(`./uploads/wallpapers/${res.tattooStyle._id}/${res.tattooStyle.wallPaper}`, err => {
        if (err) console.log(err)
      })
      await fs.rmdir(`./uploads/wallpapers/${res.tattooStyle._id}`, { recursive:true },err => {
        if (err) console.log(err)
      })
      await res.tattooStyle.remove()

      results.resultCode = 0
      results.tattooStyles = await TattooStyle.find()
      res.status(200).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

  async addTattooStyle(req, res) {
    const tattooStyle = new TattooStyle({
      value: req.body.value,
      description: req.body.description
    })

    const results = {}

    try {
      const newTattooStyle = await tattooStyle.save()
      results.resultCode = 0
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await file.mv(`./uploads/wallpapers/${newTattooStyle._id}/${newFileName}`, err => {
          tattooStyle.wallPaper = newFileName
          tattooStyle.save()
        })
      }
      results.tattooStyles = await TattooStyle.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async updateTattooStyle(req, res) {
    res.tattooStyle.value = req.body.value
    res.tattooStyle.description = req.body.description

    const results = {}

    try {
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await fs.unlink(`./uploads/wallpapers/${res.tattooStyle._id}/${res.tattooStyle.wallPaper}`, err => {
          if (err) console.log(err)
        })
        await file.mv(`./uploads/wallpapers/${res.tattooStyle._id}/${newFileName}`, err => {
          res.tattooStyle.wallPaper = newFileName
          console.log(res.tattooStyle.wallPaper + "!!!!!!!!!!!!!!!")
          res.tattooStyle.save()
        })
        //await res.category.save()
      }
      results.resultCode = 0
      results.tattooStyles = await TattooStyle.find()
      res.status(201).json(results)
    } catch (err) {
      console.log(err)
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

}

module.exports = new tattooStyleController()
