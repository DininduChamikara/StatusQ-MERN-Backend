const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");

const { createTokens, validateToken } = require("../JWT");
const promoterCampaign = require("../models/promoterCampaign");

router.get("/chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {

    let currentYearCounts = [];
    let previousYearCounts = [];

    const campaigns = await Campaign.find();

    const filteredOnCurrentYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear;
    });

    const filteredOnPreviousYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    for(let i=0; i<12; i++){
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      })
      currentYearCounts.push(filterForMonth.length)
    }

    for(let i=0; i<12; i++){
      let filterForMonth = filteredOnPreviousYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      })
      previousYearCounts.push(filterForMonth.length)
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Campaigns details chart",
      chartData: [
        {
          year: currentYear - 1,
          data: [
            {name: "Campaign Creations", data: previousYearCounts}
          ]
        },
        {
          year: currentYear,
          data: [
            {name: "Campaign Creations", data: currentYearCounts}
          ]
        },      
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all the campaigns",
      campaigns: campaigns,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:campaignId", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    res.json(campaign);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/campaign/:campaignId", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    res.json({
      responseCode: "00",
      status: "success",
      message: "Campaign Details Here",
      campaign: campaign,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/by_client/:clientId", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ clientId: req.params.clientId });
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all your campaigns",
      campaigns: campaigns,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const {
    clientId,
    platform,
    selectedAdvertisements,
    finalizedExpectedViewsAmount,
    viewsFromEach,
    numberOfPromoterSelections,
    selectedPromoterIdList,
    systemFee,
    campaignCost,
    createdTime,
    state,
  } = req.body;

  const campaign = new Campaign({
    clientId: clientId,
    platform: platform,
    selectedAdvertisements: selectedAdvertisements,
    finalizedExpectedViewsAmount: finalizedExpectedViewsAmount,
    viewsFromEach: viewsFromEach,
    numberOfPromoterSelections: numberOfPromoterSelections,
    selectedPromoterIdList: selectedPromoterIdList,
    systemFee: systemFee,
    campaignCost: campaignCost,
    createdTime: createdTime,
    state: state,
  });

  try {
    const c = await campaign.save();

    res.json({
      responseCode: "00",
      status: "success",
      message: "You are successfully created an ad-campaign",
      campaign: c,
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
