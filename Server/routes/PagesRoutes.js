const Router = require('express')
const router = new Router()
const Page = require('../models/Page')
const controller = require('../controllers/PagesController')

//getting all pages

router.get('/about', controller.getAboutPage)

// updating page

router.post('/about', controller.updateAboutPage)

// change page visibility

router.patch('/visibility/about', controller.changeAboutPageVisibility)

async function getPage(req, res, next) {
  let page

  try {
    page = await Page.findById(req.params.id)
    if (page == null) {
      return res.status(404).json({ message: 'Cannot find page' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.page = page
  next()
}

module.exports = router

