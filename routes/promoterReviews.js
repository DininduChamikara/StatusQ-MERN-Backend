const express = require("express");
const router = express.Router();
const PromoterReview = require("../models/promoterReview");

const { createTokens, validateToken } = require("../JWT");

router.get("/getPromterReviewByJobId/:jobId", async (req, res) => {
  try {
    const promoterReview = await PromoterReview.findOne({
      jobId: req.params.jobId,
    });
    res.json({
      responseCode: "00",
      status: "info",
      message: "Promoter Review Info",
      promoterReview: promoterReview,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/", async (req, res) => {
  try {
    const promoterReviews = await PromoterReview.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see promoter reviews here",
      reviews: promoterReviews,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const { jobId, promoterId, clientId, ratingCount, date, description } =
    req.body;

  PromoterReview.create({
    jobId: jobId,
    promoterId: promoterId,
    clientId: clientId,
    ratingCount: ratingCount,
    date: date,
    description: description,
  })
    .then(() => {
      res.json({
        responseCode: "00",
        status: "success",
        message: "You are successfully submitted the review",
      });
    })
    .catch((err) => {
      if (err) {
        res.status(400).json({ error: err });
      }
    });
});

module.exports = router;
