const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");

const { createTokens, validateToken } = require("../JWT");
const promoterCampaign = require("../models/promoterCampaign");

router.get("/system_earnings_chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {
    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const campaigns = await Campaign.find();

    const filteredOnCurrentYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear;
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    previousYearTotal = filteredOnPreviousYear.length;

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      });
      let monthEarned = 0;
      filterForMonth.map(item => {
        monthEarned = monthEarned + item.systemFee;
      })

      currentYearCounts.push(monthEarned);
    }

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnPreviousYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      });
      let monthEarned = 0;
      filterForMonth.map(item => {
        monthEarned = monthEarned + item.systemFee;
      })
      previousYearCounts.push(monthEarned);
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Campaigns details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [{ name: "Campaign Creations", data: previousYearCounts }],
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [{ name: "Campaign Creations", data: currentYearCounts }],
        },
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {
    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const campaigns = await Campaign.find();

    const filteredOnCurrentYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear;
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    previousYearTotal = filteredOnPreviousYear.length;

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      });
      currentYearCounts.push(filterForMonth.length);
    }

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnPreviousYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      });
      previousYearCounts.push(filterForMonth.length);
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Campaigns details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [{ name: "Campaign Creations", data: previousYearCounts }],
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [{ name: "Campaign Creations", data: currentYearCounts }],
        },
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/dashboard/system_profit_chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {
    let currentYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const campaigns = await Campaign.find({ state: "ACTIVE" });

    const filteredOnCurrentYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear;
    });
    let currentYearEarnings = 0;
    filteredOnCurrentYear.map(item => {
      currentYearEarnings = currentYearEarnings + item.systemFee;
    })

    currentYearTotal = currentYearEarnings;

    const filteredOnPreviousYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });
    let previousYearEarnings = 0;
    filteredOnPreviousYear.map(item => {
      previousYearEarnings = previousYearEarnings + item.systemFee;
    })

    previousYearTotal = previousYearEarnings;

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      });
      let monthEarned = 0;
      filterForMonth.map(item => {
        monthEarned = monthEarned + item.systemFee;
      })
      currentYearCounts.push(monthEarned);
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Earning details chart",
      chartData: {
        year: currentYear,
        total: currentYearTotal,
        percentage: previousYearTotal !=0 ? (currentYearTotal - previousYearTotal)/previousYearTotal*100 : 100, 
        data: { name: "System Profit Earnings", data: currentYearCounts },
      },
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/dashboard/chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {
    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const campaigns = await Campaign.find({ state: "ACTIVE" });

    const filteredOnCurrentYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear;
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = campaigns.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    previousYearTotal = filteredOnPreviousYear.length;

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.createdTime);
        return jsonDate.getMonth() == i;
      });
      currentYearCounts.push(filterForMonth.length);
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Campaigns details chart",
      chartData: {
        year: currentYear,
        total: currentYearTotal,
        percentage: previousYearTotal !=0 ? (currentYearTotal - previousYearTotal)/previousYearTotal*100 : 100, 
        data: { name: "Campaign Creations", data: currentYearCounts },
      },
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

router.get("/campaignsCount", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json({
      responseCode: "00",
      status: "info",
      message: "Campaigns count",
      campaignsCount: campaigns.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/getAllCampaigns", async (req, res) => {
  const { page, pageCount } = req.body;
  try {
    const campaigns = await Campaign.find();
    const filteredCampaigns = campaigns.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all the campaigns",
      campaigns: filteredCampaigns,
      total: campaigns.length,
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

router.post("/by_client", async (req, res) => {
  const { clientId, page, pageCount } = req.body;

  try {
    const campaignsList = await Campaign.find({ clientId: clientId });

    const timeDecendingOrderedList = campaignsList.reverse();

    const campaigns = timeDecendingOrderedList.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "success",
      message: "You can see all your campaigns",
      total: campaignsList.length,
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
