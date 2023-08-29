const Category = require('../models/Category')
const fs = require("fs");

class categoryController {

  async getCategories (req, res) {
    const results = {}
    try {
      const categories = await Category.find()
      results.resultCode = 0
      results.tattooStyles = categories
      res.status(200).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(500).json(results)
    }
  }

  async deleteCategory(req, res) {
    const results = {}
    try {
      await fs.unlink(`./uploads/wallpapers/${res.category._id}/${res.category.wallPaper}`, err => {
        if (err) console.log(err)
      })
      await fs.rmdir(`./uploads/wallpapers/${res.category._id}`, { recursive:true },err => {
        if (err) console.log(err)
      })
      await res.category.remove()

      const styles = await Category.find()
      results.resultCode = 0
      results.tattooStyles = styles
      res.status(200).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

  async addCategory(req, res) {
    const category = new Category({
      value: req.body.value,
      description: req.body.description
    })

    const results = {}

    try {
      const newCategory = await category.save()
      results.resultCode = 0
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await file.mv(`./uploads/wallpapers/${newCategory._id}/${newFileName}`, err => {
          category.wallPaper = newFileName
          category.save()
        })
      }
      results.tattooStyles = await Category.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async updateCategory(req, res) {
    res.category.value = req.body.value
    res.category.description = req.body.description

    const results = {}

    try {
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await fs.unlink(`./uploads/wallpapers/${res.category._id}/${res.category.wallPaper}`, err => {
          if (err) console.log(err)
        })
        await file.mv(`./uploads/wallpapers/${res.category._id}/${newFileName}`, err => {
          res.category.wallPaper = newFileName
          console.log(res.category.wallPaper + "!!!!!!!!!!!!!!!")
          res.category.save()
        })
        //await res.category.save()
      }
      results.resultCode = 0
      results.tattooStyles = await Category.find()
      res.status(201).json(results)
    } catch (err) {
      console.log(err)
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

}

module.exports = new categoryController()
