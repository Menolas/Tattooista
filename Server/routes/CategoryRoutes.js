//const express = require('express')
const Router = require('express')
const router = new Router()
const Category = require('../models/Category')
const controller = require('../controllers/categoryController')

//getting all categories

router.get('/', controller.getCategories)

// Deleting one
router.delete('/:id', getCategory, controller.deleteCategory)

// Creating category (tattooStyle)

router.post('/', controller.addCategory)

// updating category

router.post('/:id', getCategory, controller.updateCategory)

//deleting category

router.delete('/:id', getCategory, controller.deleteCategory)

async function getCategory(req, res, next) {
  let category;
  try {
    category = await Category.findById(req.params.id)
    if (category == null) {
      return res.status(404).json({ message: 'Cannot find category' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.category = category
  next()
}

module.exports = router;

