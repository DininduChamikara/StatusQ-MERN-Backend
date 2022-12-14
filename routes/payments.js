const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");

router.get("/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({userId: req.params.userId});
    res.json({
      responseCode: "00",
      status: "success",
      message: "Your transaction history is here",
      payments: payments,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const {
    userId,
    dateTime,
    senderRole,
    senderID,
    purpose,
    campaignId,
    receiverId,
    amount,
    state,
  } = req.body;

  const payment = new Payment({
    userId: userId,
    dateTime: dateTime,
    senderRole: senderRole,
    senderID: senderID,
    purpose: purpose,
    campaignId: campaignId,
    receiverId: receiverId,
    amount: amount,
    state: state,
  });

  try {
    const p = await payment.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "Your payment is completed. Thank you!",
      paymentInfo: p,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
