const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require('multer');
const url = "mongodb://localhost/StatusQ_DB_New";

var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// for timeout
var timeout = require("connect-timeout");
app.use(timeout(12000));
app.use(haltOnTimedout);

// temporary added for timeout
function haltOnTimedout(req, res, next) {
  if (!req.timedout){
    // res.json({
    //   responseCode: "00",
    //   status: "error",
    //   message: "Can't proceed now. Try again later!",
    // })
    next();
  } 
  
}

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const alienRouter = require("./routes/aliens");
app.use("/aliens", alienRouter);

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const reviewRouter = require("./routes/reviews");
app.use("/reviews", reviewRouter);

const promoterRouter = require("./routes/promoters");
app.use("/promoters", promoterRouter);

const campaignRouter = require("./routes/campaigns");
app.use("/campaigns", campaignRouter);

const promoterCampaignRouter = require("./routes/promoterCampaigns");
app.use("/promoterCampaigns", promoterCampaignRouter);

const paymentRouter = require("./routes/payments");
app.use("/payments", paymentRouter);

const paymentApprovelRouter = require("./routes/paymentApprovels");
app.use("/paymentApprovels", paymentApprovelRouter);

const promoterReviewRouter = require("./routes/promoterReviews");
app.use("/promoterReview", promoterReviewRouter);

const clientReviewRouter = require("./routes/clientReviews");
app.use("/clientReview", clientReviewRouter);

const adminSettingsRouter = require("./routes/adminSettings");
app.use("/adminSettings", adminSettingsRouter);

app.listen(9000, () => {
  console.log("Server started");
});
