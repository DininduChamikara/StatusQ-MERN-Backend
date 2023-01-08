const express = require("express");
const router = express.Router();
const PromoterCampaign = require("../models/promoterCampaign");

const { createTokens, validateToken } = require("../JWT");
const Campaign = require("../models/campaign");
const { findOne, findById } = require("../models/campaign");

// router.get("/", async (req, res) => {
//   try {
//     const promoterCampaigns = await PromoterCampaign.find();
//     res.json({
//       responseCode: "00",
//       status: "success",
//       message: "You can see all the ad campaigns",
//       promoterCampaigns: promoterCampaigns,
//     });
//   } catch (err) {
//     res.send("Error " + err);
//   }
// });

router.get("/job/:jobId", async (req, res) => {
  try {
    const promoterCampaign = await PromoterCampaign.findById(req.params.jobId);

    if (promoterCampaign) {
      const campaign = await getCampaign(promoterCampaign.campaignId);
      res.json({
        responseCode: "00",
        status: "success",
        message: "You can see the job details here",
        promoterCampaign: promoterCampaign,
        campaign: campaign,
      });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }

  async function getCampaign(campaignId) {
    const campaign = await Campaign.findById(campaignId);
    return campaign;
  }
});

router.get("/:promoterId", async (req, res) => {
  try {
    const promoterCampaigns = await PromoterCampaign.find({
      promoterId: req.params.promoterId,
    });

    // console.log(promoterCampaigns.length)

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
        jobId: element._id,
        dateTime: campaign.createdTime,
        campaignId: element.campaignId,
        clientId: element.clientId,
        platform: campaign.platform,
        adsCount: campaign.selectedAdvertisements.length,
        requiredViews: campaign.viewsFromEach,
        budget: campaign.viewsFromEach * campaign.selectedAdvertisements.length,
        acceptedTime: element.acceptedTime,
        completedTime: element.completedTime,
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

router.patch('/updateState/:id', async(req, res) => {
  // console.log("patch called")
  // res.json(req.params.id)
  try{
      const promoterCampaign = await PromoterCampaign.findById(req.params.id)
      promoterCampaign.state = req.body.state;
      promoterCampaign.acceptedTime = req.body.acceptedTime;
      promoterCampaign.completedTime = req.body.completedTime;
      promoterCampaign.screenshots = req.body.screenshots;

      const pc = await promoterCampaign.save();
      // res.json(pc)
      if(pc.state === "AVAILABLE_EXPIRED" || pc.state === "ONGOING_EXPIRED"){
        res.json({
          responseCode: "00",
          status: "warning",
          message: "This campaign is expired!",
          promoterCampaign: pc,
        });
      }else if(pc.state === "ACCEPTED"){
        res.json({
          responseCode: "00",
          status: "success",
          message: "You successfully accept the campaign!",
          promoterCampaign: pc,
        });
      }else if(pc.state === "DECLINED"){
        res.json({
          responseCode: "00",
          status: "warning",
          message: "You declined the campaign!",
          promoterCampaign: pc,
        });
      }else if(pc.state === "COMPLETED"){
        res.json({
          responseCode: "00",
          status: "success",
          message: "You successfully uploaded the screenshots!",
          promoterCampaign: pc,
        });
      }
      
  }catch(err){
      res.send('Error ' + err)
  }
})

module.exports = router;
