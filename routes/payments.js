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

router.get("/paymentsChart/chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {
    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const payments = await Payment.find();

    const filteredOnCurrentYear = payments.filter((x) => {
      let jsonDate = new Date(x.dateTime);
      return jsonDate.getFullYear() == currentYear;
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = payments.filter((x) => {
      let jsonDate = new Date(x.dateTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    previousYearTotal = filteredOnPreviousYear.length;

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.dateTime);
        return jsonDate.getMonth() == i;
      });
      currentYearCounts.push(filterForMonth.length);
    }

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnPreviousYear.filter((x) => {
        let jsonDate = new Date(x.dateTime);
        return jsonDate.getMonth() == i;
      });
      previousYearCounts.push(filterForMonth.length);
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Payment details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [{ name: "Client Payments", data: previousYearCounts }],
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [{ name: "Client Payments", data: currentYearCounts }],
        },
      ],
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

    const payments = await Payment.find();

    const filteredOnCurrentYear = payments.filter((x) => {
      let jsonDate = new Date(x.dateTime);
      return jsonDate.getFullYear() == currentYear;
    });

    let currentYearEarningTotal = 0;

    filteredOnCurrentYear.map((item) => {
      currentYearEarningTotal = currentYearEarningTotal + item.amount;
    })

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = payments.filter((x) => {
      let jsonDate = new Date(x.dateTime);
      return jsonDate.getFullYear() == currentYear - 1;
    });

    let previousYearEarningTotal = 0;

    filteredOnPreviousYear.map((item) => {
      previousYearEarningTotal = previousYearEarningTotal + item.amount;
    })

    previousYearTotal = filteredOnPreviousYear.length;

    for (let i = 0; i < 12; i++) {
      let filterForMonth = filteredOnCurrentYear.filter((x) => {
        let jsonDate = new Date(x.dateTime);
        return jsonDate.getMonth() == i;
      });

      let monthlyEarning = 0;
      filterForMonth.map((item) => {
        monthlyEarning = monthlyEarning + item.amount;
      })

      currentYearCounts.push(monthlyEarning);
    }

    res.json({
      responseCode: "00",
      status: "info",
      message: "Payment details chart",
      chartData: {
        year: currentYear,
        total: currentYearTotal,
        totalEarnings: currentYearEarningTotal,
        percentage: previousYearEarningTotal != 0 ? (currentYearEarningTotal - previousYearEarningTotal)/previousYearEarningTotal*100 : 100, 
        data: { name: "Client Payments", data: currentYearCounts },
      },
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/getClientPaymentsByPost", async (req, res) => {
  const { page, pageCount } = req.body;
  try {
    const payments = await Payment.find();
    const filteredPayments = payments.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

    res.json({
      responseCode: "00",
      status: "info",
      message: "All the client payment records here",
      payments: filteredPayments,
      total: payments.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
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
    const payments = await Payment.find({ userId: userId });

    const finalizedPayments = payments.slice(
      page * pageCount,
      page * pageCount + pageCount
    );

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
