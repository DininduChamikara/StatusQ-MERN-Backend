const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");

const { createTokens, validateToken } = require("../JWT");
const promoterCampaign = require("../models/promoterCampaign");

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
