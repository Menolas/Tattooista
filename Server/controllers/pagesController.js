const Page = require("../models/Page")
const fs = require("fs")
const generateFileRandomName = require("../utils/functions")

class PagesController {

  async getAboutPage (req, res) {
    const results = {}
    try {
      results.page = await Page.findOne({name: 'about'})
      results.resultCode = 0
      res.status(200).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(500).json(results)
    }
  }

  async updateAboutPage(req, res) {
    const results = {}

    try {
      const page = await Page.findOne({name: 'about'})
      page.title = req.body.title
      page.content = req.body.content
      if(req.files && req.files.wallPaper) {
        const file = req.files.wallPaper
        if(!file)  return res.json({error: 'Incorrect input name'})
        const newFileName = generateFileRandomName(file.name)
        await fs.unlink(`./uploads/pageWallpapers/${page._id}/${page.wallPaper}`, e => {
          if (e) console.log(e)
        })
        await file.mv(`./uploads/pageWallpapers/${page._id}/${newFileName}`, e => {
          if (e) console.log(e)
        })
        page.wallPaper = newFileName
      }

      results.resultCode = 0
      results.page = await page.save()
      res.status(201).json(results)
    } catch (e) {
      console.log(e)
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async changeAboutPageVisibility(req, res) {
    try {
      const page = await Page.findOne({name: 'about'})

      if (!page) {
        return res.status(404).json({ resultCode: 1, message: 'Page not found' });
      }
      page.isActive = !page.isActive

      console.log(page + "  Page !!!!!!!!!!")
      const updatePage = await page.save()
      res.status(201).json({resultCode: 0, page: updatePage})
    } catch (e) {
      res.status(400).json({resultCode: 1, message: e.message})
    }
  }
}

module.exports = new PagesController()
