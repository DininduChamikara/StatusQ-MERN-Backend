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

router.get("/getPromterReviewsByPromoterId/:promoterId", async (req, res) => {
  try {
    const promoterReviews = await PromoterReview.find({
      promoterId: req.params.promoterId,
    });
    res.json({
      responseCode: "00",
      status: "info",
      message: "Promoter's reviews",
      promoterReviews: promoterReviews,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/getPromterReviewsChartDataByPromoterId/:promoterId", async (req, res) => {
  try {
    const promoterReviews = await PromoterReview.find({
      promoterId: req.params.promoterId,
    });

    let star_5 = 0;
    let star_4 = 0;
    let star_3 = 0;
    let star_2 = 0;
    let star_1 = 0;

    promoterReviews.map((item) => {
      if(item.ratingCount == 5){
        star_5 = star_5 + 1;
      }else if(item.ratingCount == 4){
        star_4 = star_4 + 1;
      }else if(item.ratingCount == 3){
        star_3 = star_3 + 1;
      }else if(item.ratingCount == 2){
        star_2 = star_2 + 1;
      }else if(item.ratingCount == 1){
        star_1 = star_1 + 1;
      }
    });

    res.json({
      responseCode: "00",
      status: "info",
      message: "Promoter's reviews chart details",
      chartData: [star_5, star_4, star_3, star_2, star_1],
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
