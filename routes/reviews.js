const express = require("express");
const router = express.Router();
const Review = require("../models/review");

const { createTokens, validateToken } = require("../JWT");

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all our reviews here",
      isVisible: true,
      reviews: reviews,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

// did not check
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.userId);
    res.json(review);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const { userId, firstname, lastname, ratingCount, date, description, imageUrl } = req.body;
  const review = await Review.findOne({ userId: userId });

  if (review) {
    review.firstname = firstname;
    review.lastname = lastname;
    review.ratingCount = ratingCount;
    review.date = date;
    review.description = description;
    review.imageUrl = imageUrl;

    const r = await review.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You are successfully eddited your review",
    });
  } else {
    Review.create({
      userId: userId,
      firstname: firstname,
      lastname: lastname,
      ratingCount: ratingCount,
      date: date,
      description: description,
      imageUrl: imageUrl
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
  }
});

// did not check
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.userId);
    const r = await review.delete();
    res.json(r);
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
