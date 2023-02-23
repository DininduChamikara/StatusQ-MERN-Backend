const express = require("express");
const router = express.Router();
const PaymentApprovel = require("../models/paymentApprovel");

router.get("/", async (req, res) => {
  try {
    const paymentPaarovels = await PaymentApprovel.find();
    res.json({
      responseCode: "00",
      status: "info",
      message: "All the payment approvel records here",
      paymentApprovels: paymentPaarovels,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/byPromoterId/:promoterId", async (req, res) => {
  try {
    const paymentApprovels = await PaymentApprovel.find({
      promoterId: req.params.promoterId,
    });
    res.json({
      responseCode: "00",
      status: "success",
      message: "All payment approvel details",
      paymentApprovels: paymentApprovels,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/getEarnings/byPromoterId", async (req, res) => {
  const { promoterId, lastWithdrawalDateTime } = req.body;

  let lwdt = new Date(lastWithdrawalDateTime);

  try {
    const paymentApprovels = await PaymentApprovel.find({
      promoterId: promoterId,
    });

    const filteredPaymentApprovels = paymentApprovels.filter((x) => {
      let jsonDate = new Date(x.dateTime);
      return jsonDate.getTime() > lwdt;
    });

    let totalEarnings = 0;
    let earningsAfterLastWitdrawal = 0;

    paymentApprovels.map((item) => {
      totalEarnings = totalEarnings + item.paymentAmount;
    })

    filteredPaymentApprovels.map((item) => {
      earningsAfterLastWitdrawal = earningsAfterLastWitdrawal + item.paymentAmount;
    })

    res.json({
      responseCode: "00",
      status: "info",
      message: "All your payment receivings here",
      totalEarnings: totalEarnings,
      earningsAfterLastWitdrawal: earningsAfterLastWitdrawal
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/byPromoterId", async (req, res) => {
  const { promoterId, page, pageCount } = req.body;
  try {
    const paymentApprovels = await PaymentApprovel.find({
      promoterId: promoterId,
    });

    const timeDecendingOrderedList = paymentApprovels.reverse();

    const finalizedPaymentApprovels = timeDecendingOrderedList.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "info",
      message: "All your payment receivings here",
      total: paymentApprovels.length,
      paymentApprovels: finalizedPaymentApprovels,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const currentDate = new Date();

  const { jobId, promoterId, clientId, paymentAmount, paymentType, state } =
    req.body;

  const paymentApprovel = new PaymentApprovel({
    jobId: jobId,
    promoterId: promoterId,
    clientId: clientId,
    dateTime: currentDate,
    paymentAmount: paymentAmount,
    paymentType: paymentType,
    state: state,
  });

  try {
    const pa = await paymentApprovel.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "Successfully approved the payment. Thank you!",
      paymentApprovel: pa,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
