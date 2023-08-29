const Page = require('../models/Page')
const fs = require("fs");

class PagesController {

  async getPages (req, res) {
    const results = {}
    try {
      const pages = await Page.find()
      results.resultCode = 0
      results.pages = pages
      res.status(200).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(500).json(results)
    }
  }

  // async deletePage(req, res) {
  //   const results = {}
  //   try {
  //     await fs.unlink(`./uploads/wallpapers/${res.category._id}/${res.category.wallPaper}`, err => {
  //       if (err) console.log(err)
  //     })
  //     await fs.rmdir(`./uploads/wallpapers/${res.category._id}`, err => {
  //       if (err) console.log(err)
  //     })
  //     await res.category.remove()
  //
  //     const styles = await Category.find()
  //     results.resultCode = 0
  //     results.tattooStyles = styles
  //     res.status(200).json(results)
  //   } catch (err) {
  //     results.resultCode = 1
  //     results.message = err.message
  //     res.status(500).json(results)
  //   }
  // }

  // async addPage(req, res) {
  //   const page = new Page({
  //     name: req.body.name,
  //     content: req.body.content
  //   })
  //
  //   const results = {}
  //
  //   try {
  //     const newPage = await page.save()
  //     results.resultCode = 0
  //     if(req.files && req.files.wallPaper) {
  //       const file = req.files.wallPaper
  //       if(!file)  return res.json({error: 'Incorrect input name'})
  //       const newFileName = encodeURI(Date.now() + '_' + file.name)
  //       await file.mv(`./uploads/pageWallpapers/${newPage._id}/${newFileName}`, err => {
  //         category.wallPaper = newFileName
  //         category.save()
  //       })
  //     }
  //     results.tattooStyles = await Category.find()
  //     res.status(201).json(results)
  //   } catch (err) {
  //     results.resultCode = 1
  //     results.message = err.message
  //     res.status(400).json(results)
  //   }
  // }

  async updatePage(req, res) {
    res.page.title = req.body.title
    res.page.content = req.body.content

    const results = {}

    try {
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await fs.unlink(`./uploads/pageWallpapers/${res.page._id}/${res.page.wallPaper}`, err => {
          if (err) console.log(err)
        })
        await file.mv(`./uploads/pageWallpapers/${res.page._id}/${newFileName}`, err => {
          res.page.wallPaper = newFileName
          res.page.save()
        })
      }
      await res.page.save()
      results.resultCode = 0
      results.pages = await Page.find()
      res.status(201).json(results)
    } catch (err) {
      console.log(err)
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async changePageVisibility(req, res) {
    res.page.isActive = !req.body.isActive
    const results = {}

    try {
      await  res.page.save()
      results.resultCode = 0
      results.pages = await Page.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

}

module.exports = new PagesController()
