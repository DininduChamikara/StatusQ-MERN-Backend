const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require('multer');
const url = "mongodb://localhost/StatusQ_DB_New";

const app = express();

// for timeout
var timeout = require("connect-timeout");
app.use(timeout(12000));
app.use(haltOnTimedout);

// temporary added for timeout
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
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


app.listen(9000, () => {
  console.log("Server started");
});
