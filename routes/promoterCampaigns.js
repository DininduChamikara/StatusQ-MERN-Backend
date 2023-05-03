const express = require("express");
const router = express.Router();
const PromoterCampaign = require("../models/promoterCampaign");

const { createTokens, validateToken } = require("../JWT");
const Campaign = require("../models/campaign");
const { findOne, findById } = require("../models/campaign");

//============================================================
// get job data by job ID
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

//============================================================
router.get("/promoterCampaignsByCampaign/:campaignId", async (req, res) => {
  try {
    const promoterCampaigns = await PromoterCampaign.find({campaignId:req.params.campaignId });
    res.json({
      responseCode: "00",
      status: "success",
      message: "Selected promoters list for the campaign",
      promoterCampaigns: promoterCampaigns,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//============================================================
// get promoterCampigns by campaign ID (Table Format)
router.post("/promoterCampaignsByCampaign", async (req, res) => {
  const {campaignId, page, pageCount} = req.body;

  try {
    const promoterCampaigns = await PromoterCampaign.find({campaignId: campaignId });
    const timeDecendingOrderedList = promoterCampaigns.reverse();

    const finalizedPromoterCampaigns = timeDecendingOrderedList.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "success",
      message: "Selected promoters list for the campaign",
      promoterCampaigns: finalizedPromoterCampaigns,
      total: promoterCampaigns.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//============================================================
// get all promoter campaigns
router.get("/promoterCampaignsAll", async (req, res) => {
  try {
    const promoterCampaigns = await PromoterCampaign.find();
    res.json({
      responseCode: "00",
      status: "info",
      message: "All promoter campaign details here",
      promoterCampaigns: promoterCampaigns,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//============================================================
// get all promoter campaigns (Table format)
router.post("/promoterCampaignsAll", async (req, res) => {
  const {page, pageCount} = req.body;

  try {
    const promoterCampaigns = await PromoterCampaign.find();

    const filteredPromoterCampaigns = promoterCampaigns.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "info",
      message: "All promoter campaign details here",
      promoterCampaigns: filteredPromoterCampaigns,
      total: promoterCampaigns.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//============================================================
// get available campaigns by promoter ID
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

//============================================================
// get promoter campaigns by promoter ID (Table format)
router.post("/byPromoterId", async (req, res) => {

  const {
    promoterId,
    page,
    pageCount,
  } = req.body;

  try {
    const promoterCampaigns = await PromoterCampaign.find({
      promoterId: promoterId,
    });

    const timeDecendingOrderedList = promoterCampaigns.reverse();

    const finalizedPromoterCampaigns = timeDecendingOrderedList.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    getResData(finalizedPromoterCampaigns);
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
        campaignId: element.campaignId ? element.campaignId : "",
        clientId: element.clientId ? element.clientId : "",
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
        const temp = promoterCampaignObjArr;

        res.json({
          responseCode: "00",
          status: "info",
          message: "Your campaigns details here",
          total: temp.length,
          isVisible: true,
          promoterCampaigns: temp,
        });
      }
    });
  }
});

//============================================================
// save promoterCampaign
router.post("/", async (req, res) => {
  const { clientId, promoterId, campaignId, state, paymentApproved } = req.body;

  const currentTime = Date.now();

  const promoterCampaign = new PromoterCampaign({
    clientId: clientId,
    promoterId: promoterId,
    campaignId: campaignId,
    paymentApproved: paymentApproved,
    state: state,
    createdTime: currentTime,
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

//============================================================
// update promoterCampaign
router.patch('/updateState/:id', async(req, res) => {
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

//============================================================
// update payment approvel by id
router.patch('/updatePaymentApproved/:id', async(req, res) => {
  try{
      const promoterCampaign = await PromoterCampaign.findById(req.params.id)
      promoterCampaign.paymentApproved = req.body.paymentApproved;

      const pc = await promoterCampaign.save();

      if(pc.paymentApproved === true){
        res.json({
          responseCode: "00",
          status: "success",
          message: "You approved the payment!",
          promoterCampaign: pc,
        })
      }
      
  }catch(err){
      res.send('Error ' + err)
  }
})

//============================================================
// get promoter campaign chart data
router.get("/chart/chart_data", async (req, res) => {

  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {

    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const promoterCampaigns = await PromoterCampaign.find();

    const filteredOnCurrentYear = promoterCampaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear;
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = promoterCampaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    previousYearTotal = filteredOnPreviousYear.length;

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
      message: "Promoter Campaigns details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [
            {name: "Promoter allocations for Campaigns", data: previousYearCounts}
          ]
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [
            {name: "Promoter allocations for Campaigns", data: currentYearCounts}
          ]
        },      
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
