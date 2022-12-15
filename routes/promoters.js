const express = require("express");
const router = express.Router();
const Promoter = require("../models/promoter");

const { createTokens, validateToken } = require("../JWT");

router.get("/", async (req, res) => {
  try {
    const promoters = await Promoter.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all our promoters here",
      promoters: promoters,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

// did not check
// router.get("/:id", async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.userId);
//     res.json(review);
//   } catch (err) {
//     res.send("Error " + err);
//   }
// });

router.post("/", async (req, res) => {
  const {
    userId,
    fullName,
    nameWithInit,
    dob,
    gender,
    nic,
    address,
    postcode,
    province,
    language,
    educationalCategory,
    socialMediaList,
    promoterGenderAudienceList,
    promoterAudienceCategoryList,
    state,
  } = req.body;
  const promoter = await Promoter.findOne({ userId: userId });

  if (promoter) {
    promoter.fullName = fullName;
    promoter.nameWithInit = nameWithInit;
    promoter.dob = dob;
    promoter.gender = gender;
    promoter.nic = nic;
    promoter.address = address;
    promoter.postcode = postcode;
    promoter.province = province;
    promoter.language = language;
    promoter.educationalCategory = educationalCategory;
    promoter.socialMediaList = socialMediaList;
    promoter.promoterGenderAudienceList = promoterGenderAudienceList;
    promoter.promoterAudienceCategoryList = promoterAudienceCategoryList;
    promoter.state = state;

    const p = await promoter.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You are successfully updated the promoter survey details",
    });
  } else {
    Promoter.create({
      userId: userId,
      fullName: fullName,
      nameWithInit: nameWithInit,
      dob: dob,
      gender: gender,
      nic: nic,
      address: address,
      postcode: postcode,
      province: province,
      language: language,
      educationalCategory: educationalCategory,
      socialMediaList: socialMediaList,
      promoterGenderAudienceList: promoterGenderAudienceList,
      promoterAudienceCategoryList: promoterAudienceCategoryList,
      state: state,
    })
      .then(() => {
        res.json({
          responseCode: "00",
          status: "success",
          message: "You are successfully submitted the promoter survey",
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
// router.delete("/:id", async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.userId);
//     const r = await review.delete();
//     res.json(r);
//   } catch (err) {
//     res.send("Error " + err);
//   }
// });

module.exports = router;
