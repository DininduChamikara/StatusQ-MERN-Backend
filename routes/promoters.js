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
      message: "You can see all promoters here",
      promoters: promoters,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const promoter = await Promoter.findOne({ userId: req.params.id });
    res.json(promoter);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/promoter/:id", async (req, res) => {
  try {
    const promoter = await Promoter.findOne({ userId: req.params.id });
    res.json({
      responseCode: "00",
      status: "info",
      message: "Available Promoter Details",
      promoter: promoter,
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

router.post("/getPromotersList", async (req, res) => {
  const {
    platform,
    minAccessibleViews,
    educationAudience,
    ageAudience,
    regionalAudience,
    languageAudience,
    genderAudience,
    responseCount,
    state,
  } = req.body;

  // these 2 arrays should pararal
  const campaignAudienceArr = [
    educationAudience,
    ageAudience,
    regionalAudience,
    languageAudience,
  ];
  const promoterAudienceCatTypeArr = ["education", "age", "region", "language"];

  const promoters = await Promoter.find();
  const qualifiedPromoters = promoters.filter(
    (p) =>
      (p.socialMediaList[0].platform === platform &&
        p.socialMediaList[0].accessibleViewsCount >= minAccessibleViews) ||
      (p.socialMediaList[1].platform === platform &&
        p.socialMediaList[1].accessibleViewsCount >= minAccessibleViews) ||
      (p.socialMediaList[2].platform === platform &&
        p.socialMediaList[2].accessibleViewsCount >= minAccessibleViews)
  );

  let matchIndexEach = 0;

  const matchedPromotersList = [];

  qualifiedPromoters.map((promoter) => {
    promoter.promoterAudienceCategoryList.map((audCat) => {
      if (audCat.platform === platform) {
        promoterAudienceCatTypeArr.map((cat) => {
          if (audCat.categoryType === cat) {
            campaignAudienceArr.map((camAudCat) => {
              camAudCat.map((category) => {
                if (category === audCat.category) {
                  let minAccessViews = 0;
                  promoter.socialMediaList.map((platformX) => {
                    if (platformX.platform === platform) {
                      minAccessViews = platformX.accessibleViewsCount;
                      matchIndexEach =
                        matchIndexEach + audCat.count / minAccessViews;
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
    promoter.promoterGenderAudienceList.map((genAudCat) => {
      if (genAudCat.platform === platform) {
        genderAudience.map((genCat) => {
          if (genCat === "male") {
            matchIndexEach = matchIndexEach + genAudCat.malePercentage / 100;
          } else if (genCat === "female") {
            matchIndexEach = matchIndexEach + genAudCat.femalePercentage / 100;
          }
        });
      }
    });
    const matchedPromoterObj = {
      promoter: promoter,
      matchIndex: matchIndexEach,
    };
    // console.log("matchIndexForEach is promoter", matchIndexEach)
    matchedPromotersList.push(matchedPromoterObj);
  });

  const sortedList = matchedPromotersList.sort(
    (a, b) => b.matchIndex - a.matchIndex
  );
  const filteredList = sortedList.slice(0, responseCount);

  res.json({
    responseCode: "00",
    status: "success",
    message: "The most suitable promoters list is generated",
    promoterListFinalResponseItemDTO: filteredList,
  });
});

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
