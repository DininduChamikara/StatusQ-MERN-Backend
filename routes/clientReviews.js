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
