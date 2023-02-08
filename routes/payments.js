const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");

router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json({
      responseCode: "00",
      status: "info",
      message: "All the client payment records here",
      payments: payments,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

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

router.post("/byUserId", async (req, res) => {
  const { userId, page, pageCount } = req.body;
  try {
    const payments = await Payment.find({userId: userId});

    const finalizedPayments = payments.slice(page*pageCount, page*pageCount + pageCount)

    res.json({
      responseCode: "00",
      status: "success",
      message: "Your transaction history is here",
      total: payments.length,
      payments: finalizedPayments,
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
