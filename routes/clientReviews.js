const express = require("express");
const router = express.Router();
const ClientReview = require("../models/clientReview");

const { createTokens, validateToken } = require("../JWT");

router.get("/", async (req, res) => {
  try {
    const clientReviews = await ClientReview.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see client reviews here",
      reviews: clientReviews,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/getClientReviewByJobId/:jobId", async (req, res) => {
  try {
    const clientReview = await ClientReview.findOne({
      jobId: req.params.jobId,
    });
    res.json({
      responseCode: "00",
      status: "info",
      message: "Client Review Info",
      clientReview: clientReview,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/getClientReviewsAvarageByClientId/:clientId", async (req, res) => {
  try {
    const clientReviews = await ClientReview.find({
      clientId: req.params.clientId,
    });

    let star_5 = 0;
    let star_4 = 0;
    let star_3 = 0;
    let star_2 = 0;
    let star_1 = 0;

    clientReviews.map((item) => {
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

    let ratingsAvarage = (star_1*1 + star_2*2 + star_3*3 + star_4*4 + star_5*5)/(star_1 + star_2 + star_3 + star_4 + star_5);

    res.json({
      responseCode: "00",
      status: "info",
      message: "Client's reviews details",
      ratingsAvarage: ratingsAvarage,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const {
    jobId,
    promoterId,
    clientId,
    ratingCount,
    date,
    description,
  } = req.body;

  ClientReview.create({
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
