const express = require("express");
const router = express.Router();
const AdminSettings = require("../models/adminSettings");

const { createTokens, validateToken } = require("../JWT");

router.get("/", async (req, res) => {
  try {
    const adminSettingsArray = await AdminSettings.find();

    const adminSettings = adminSettingsArray[0];

    res.json({
      responseCode: "00",
      status: "info",
      message: "Admin Settings Details",
      isVisible: false,
      adminSettings: adminSettings,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const {
    maxAdPostsForCampaign,
    costPerView,
    systemFee,
    minimumThreshold,
    acceptTimeDuration,
    completeTimeDuration,
    updatedDate,
  } = req.body;
  const adminSettingsArray = await AdminSettings.find();

  const adminSettings = adminSettingsArray[0];

  if (adminSettings) {
    adminSettings.maxAdPostsForCampaign = maxAdPostsForCampaign;
    adminSettings.costPerView = costPerView;
    adminSettings.systemFee = systemFee;
    adminSettings.minimumThreshold = minimumThreshold;
    adminSettings.acceptTimeDuration = acceptTimeDuration;
    adminSettings.completeTimeDuration = completeTimeDuration;
    adminSettings.updatedDate = updatedDate;

    const s = await adminSettings.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You are successfully update the settings",
      adminSettings: s,
    });
  } else {
    AdminSettings.create({
      maxAdPostsForCampaign: maxAdPostsForCampaign,
      costPerView: costPerView,
      systemFee: systemFee,
      minimumThreshold: minimumThreshold,
      acceptTimeDuration: acceptTimeDuration,
      completeTimeDuration: completeTimeDuration,
      updatedDate: updatedDate,
    })
      .then(() => {
        res.json({
          responseCode: "00",
          status: "success",
          message: "You are successfully initialized the settings",
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
