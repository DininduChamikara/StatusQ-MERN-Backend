const express = require("express");
const router = express.Router();
const Promoter = require("../models/promoter");

const { createTokens, validateToken } = require("../JWT");

//=======================================================
// get all promoters
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

//=======================================================
// get total promoters count
router.get("/getPromotersCount", async (req, res) => {
  try {
    const promoters = await Promoter.find();
    res.json({
      responseCode: "00",
      status: "info",
      message: "Promoters count",
      promotersCount: promoters.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get all promoters (Table format)
router.post("/getAllPromoters", async (req, res) => {
  const { page, pageCount } = req.body;

  try {
    const promoters = await Promoter.find();

    const filteredPromoters = promoters.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all promoters here",
      promoters: filteredPromoters,
      total: promoters.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get promoter by ID
router.get("/:id", async (req, res) => {
  try {
    const promoter = await Promoter.findOne({ userId: req.params.id });
    res.json(promoter);
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
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

//=======================================================
// get promoter chart data 
router.get("/promotersChart/chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {

    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const promoters = await Promoter.find();

    const filteredOnCurrentYear = promoters.filter((x) => {
      let jsonDate = new Date(x.updatedTime);
      return jsonDate.getFullYear() == currentYear;
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = promoters.filter((x) => {
      let jsonDate = new Date(x.updatedTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    previousYearTotal = filteredOnPreviousYear.length;

    for(let i=0; i<12; i++){
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.updatedTime);
        return jsonDate.getMonth() == i;
      })
      currentYearCounts.push(filterForMonth.length)
    }

    for(let i=0; i<12; i++){
      let filterForMonth = filteredOnPreviousYear.filter((x) => {
        let jsonDate = new Date(x.updatedTime);
        return jsonDate.getMonth() == i;
      })
      previousYearCounts.push(filterForMonth.length)
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Promoter details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [
            {name: "Promoter Registrations", data: previousYearCounts}
          ]
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [
            {name: "Promoter Registrations", data: currentYearCounts}
          ]
        },      
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//========================================================================
// for getting most suitable promoters list for the advertisement campaign
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

  // to get all promoters that system has
  const promoters = await Promoter.find();
  // filter the qualified promoters only
  const qualifiedPromoters = promoters.filter(
    (p) =>
      (p.socialMediaList[0].platform === platform &&
        p.socialMediaList[0].accessibleViewsCount >= minAccessibleViews) ||
      (p.socialMediaList[1].platform === platform &&
        p.socialMediaList[1].accessibleViewsCount >= minAccessibleViews) ||
      (p.socialMediaList[2].platform === platform &&
        p.socialMediaList[2].accessibleViewsCount >= minAccessibleViews)
  );

  // initialize tha match index
  let matchIndexEach = 0;

  const matchedPromotersList = [];

  // go to each qualified promoter
  qualifiedPromoters.map((promoter) => {
    // visit each qualified promoter's audience category
    promoter.promoterAudienceCategoryList.map((audCat) => {
      // check with campaign required platform and promoter's available social media platforms
      if (audCat.platform === platform) {
        // go to each audience category type
        promoterAudienceCatTypeArr.map((cat) => {
          // check the each audience category with campaign required audience category
          if (audCat.categoryType === cat) {
            // go to each campaign required audience category
            campaignAudienceArr.map((camAudCat) => {
              camAudCat.map((category) => {
                // check campaign audience categories with promoter's audience categories
                if (category === audCat.category) {
                  let minAccessViews = 0;
                  // go to each promoters social media platform
                  promoter.socialMediaList.map((platformX) => {
                    if (platformX.platform === platform) {
                      // get minimum accessible views amount
                      minAccessViews = platformX.accessibleViewsCount;
                      // generate match index for each audiece category
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
    // go to each peomoter's audience based on gender
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
    // create matched promoters objects list with their match indexes
    matchedPromotersList.push(matchedPromoterObj);
  });

  // sort the matched promoter list based on match indexes
  const sortedList = matchedPromotersList.sort(
    (a, b) => b.matchIndex - a.matchIndex
  );

  // filter the list on required response count
  const filteredList = sortedList.slice(0, responseCount);

  res.json({
    additional_for_testing: {
      promoters: promoters.length,
      qualifiedPromoters: qualifiedPromoters.length
    },
    responseCode: "00",
    status: "success",
    message: "The most suitable promoters list is generated",
    promoterListFinalResponseItemDTO: filteredList,
  });
});

//===================================================
// save a promoter
router.post("/", async (req, res) => {
  const date = new Date();

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
    promoter.updatedTime = date;
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
      promoter: p,
    });
  } else {
    Promoter.create({
      userId: userId,
      updatedTime: date,
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
          promoter: p,
        });
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  }
});

module.exports = router;
