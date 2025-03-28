const Review = require("../models/Review");
const ReviewService = require("../services/reviewService");
const fs = require('fs').promises;
const path = require("path");
const generateFileRandomName = require("../utils/functions");
const generateFileRandomNameWithDate = require("../utils/functions");

class reviewsController {

  async getReviews(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const term = req.query.term;
    const gallery = req.query.gallery;
    const rate = req.query.rate;

    const results = {};

    try {
      const matchStage = {};

      if (term) {
        const regex = new RegExp(term, 'i');

        matchStage.$or = [
          { content: regex },
          { 'user.displayName': regex },
        ];
      }

      if (gallery === 'true') {
        matchStage.gallery = { $exists: true, $not: { $size: 0 } };
      } else if (gallery === 'false') {
        matchStage.$or = [{ gallery: { $exists: true, $size: 0 } }, { gallery: { $exists: false } }];
      }

      if (rate && rate !== 'any' && rate !== '0') {
        matchStage.rate = parseInt(rate);
      }

      const pipeline = [
        { $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }},
        { $unwind: '$user' },
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $facet: {
            paginatedResults: [
              { $skip: startIndex },
              { $limit: limit }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      ];

      const data = await Review.aggregate(pipeline);
      const reviews = data[0].paginatedResults;
      const totalCount = data[0].totalCount[0]?.count || 0;

      results.resultCode = 0;
      results.reviews = reviews;
      results.totalCount = totalCount;
      res.json(results);
    } catch (e) {
      console.log(e);
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }


  async addReview(req, res) {
    if (!req.isRightUser) {
      return res.status(403).json({ message: "You don't have permission - reviews controller" });
    }
    const results = {};
    try {
      const review = await ReviewService.addReview(req.body, req.params.id);
      console.log(JSON.stringify(req.body) + " request body")
      if(req.files && Object.keys(req.files).length > 0) {
        const files = req.files;
        let gallery = [];
        for (let key in files) {
          const fileEntry = req.files[key];
          const filesArray = Array.isArray(fileEntry) ? fileEntry : [fileEntry];

          for (const file of filesArray) {
            const fileNewName = generateFileRandomNameWithDate(file.name);
            const uploadPath = `./uploads/reviews/${review._id}/${fileNewName}`;

            try {
              await file.mv(uploadPath);
              gallery.push(fileNewName);
            } catch (err) {
              console.error('Error moving file:', err);
              throw err;
            }
          }
        }
        review.gallery = gallery;
        await review.save();
      }

      results.review = review;
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async updateReview(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission - reviews controller" });
    }

    const results = {};

    try {
      const updatedReview = await ReviewService.editReview(res.review, req.body);

      results.resultCode = 0;
      results.service = await updatedReview.save();
      res.status(201).json(results);
    } catch (e) {
      console.log(e);
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteReview(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission - reviews controller" });
    }

    const results = {};

    try {
      await res.review.remove();

      results.resultCode = 0;
      results.review = res.review;
      res.status(200).json(results);

    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }
}

module.exports = new reviewsController();
