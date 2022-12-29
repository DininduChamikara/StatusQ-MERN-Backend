const express = require("express");
const router = express.Router();
const PromoterCampaign = require("../models/promoterCampaign");

const { createTokens, validateToken } = require("../JWT");
const Campaign = require("../models/campaign");
const { findOne, findById } = require("../models/campaign");

router.get("/", async (req, res) => {
  try {
    const promoterCampaigns = await PromoterCampaign.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all the ad campaigns",
      promoterCampaigns: promoterCampaigns,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:promoterId", async (req, res) => {
  try {
    const promoterCampaigns = await PromoterCampaign.find({
      promoterId: req.params.promoterId,
    });

    getResData(promoterCampaigns);
  } catch (err) {
    res.status(400).json({ error: err });
  }

  async function getCampaign(campaignId) {
    const campaign = await Campaign.findById(campaignId);
    return campaign;
  }

  function getResData(promoterCampaigns) {
    const promoterCampaignObjArr = [];

    promoterCampaigns.forEach(async (element, index, array) => {
      const campaign = await getCampaign(element.campaignId);

      const promoterCampaignObj = {
        dateTime: campaign.createdTime,
        campaignId: element.campaignId,
        clientId: element.clientId,
        platform: campaign.platform,
        adsCount: campaign.selectedAdvertisements.length,
        budget: campaign.viewsFromEach,
        state: element.state,
      };

      promoterCampaignObjArr.push(promoterCampaignObj);

      if (index === array.length - 1) {
        // console.log(promoterCampaignObjArr);
        const temp = promoterCampaignObjArr;

        res.json({
          responseCode: "00",
          status: "success",
          message: "You can see all the available campaigns here",
          promoterCampaigns: temp,
        });
      }
    });
  }
});

router.post("/", async (req, res) => {
  const { clientId, promoterId, campaignId, state, paymentApproved } = req.body;

  const promoterCampaign = new PromoterCampaign({
    clientId: clientId,
    promoterId: promoterId,
    campaignId: campaignId,
    paymentApproved: paymentApproved,
    state: state,
  });

  try {
    const pc = await promoterCampaign.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "Successfully saved promoter campaign test",
      promoterCampaign: pc,
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
