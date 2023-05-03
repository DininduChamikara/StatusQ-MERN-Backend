const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("../JWT");

//========================================================
// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      responseCode: "00",
      status: "success",
      message: "View user desils",
      users: users,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get total user count
router.get("/usersCount", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      responseCode: "00",
      status: "info",
      message: "Total Users Count",
      usersCount: users.length,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get user by ID (not used)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get user by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({
      responseCode: "00",
      status: "info",
      message: "User Details",
      user: user,
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// save a user (register the user)
router.post("/", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    res.json({
      responseCode: "1000",
      isVisible: true,
      status: "error",
      message: "Already you have an account",
    });
  } else {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        userType: req.body.userType,
        createdTime: req.body.createdTime,
        state: req.body.state,
      })
        .then(() => {
          res.json({
            responseCode: "00",
            status: "success",
            isVisible: true,
            message: "You are registered successfully",
          });
        })
        .catch((err) => {
          if (err) {
            res.status(400).json({ error: err });
          }
        });
    });
  }
});

//=======================================================
// system login for admin and mormal user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      responseCode: "1000",
      status: "failure",
      message: "Invalid Username or Password",
    });
  } else {
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then((match) => {
      if (!match) {
        res.status(400).json({
          responseCode: "1000",
          isVisible: true,
          status: "failure",
          message: "Invalid Username or Password",
        });
      } else {
        const accessToken = createTokens(user);
        res.cookie("access-token", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
          // for more safty
          httpOnly: true,
        });

        res.json({
          responseCode: "00",
          status: "success",
          isVisible: true,
          message: "You are logged successfully",
          user: user,
        });
      }
    });
  }
});

//=======================================================
// change password 
router.post("/changePassword", async (req, res) => {
  const { userId, currentPassword, password, confirmPassword } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    res.status(400).json({
      responseCode: "1000",
      status: "failure",
      isVisible: true,
      message: "Invalid Username or Password",
    });
  } else {
    const dbPassword = user.password;
    bcrypt.compare(currentPassword, dbPassword).then((match) => {
      if (!match) {
        res.status(400).json({
          responseCode: "1000",
          status: "failure",
          isVisible: true,
          message: "Entered current password is invalid",
        });
      } else if(password !== confirmPassword){
        res.status(400).json({
          responseCode: "1000",
          status: "failure",
          isVisible: true,
          message: "Password is not match with confirm password",
        });
      } else {
        bcrypt.hash(req.body.password, 10).then(async (hash) => {
          user.password = hash;
          try {
            const changedUser = await user.save();
            res.json({
              responseCode: "00",
              status: "success",
              isVisible: true,
              message: "Password changed successfully!",
            });
          } catch (err) {
            res.json(err);
          }
        });
      }
    });
  }
});

//=======================================================
// save user's personal infomation
router.post("/saveSettings", async (req, res) => {
  const {
    userId,
    imgUrl,
    contactName,
    contactEmail,
    contactPhone,
    accountStatus,
    bankName,
    branchName,
    branchCode,
    accountNumber,
    accountHolderName,
  } = req.body;

  let user;

  try {
    user = await User.findOne({ _id: userId });
    if (user) {
      user.imgUrl = imgUrl;
      user.contactName = contactName;
      user.contactEmail = contactEmail;
      user.contactPhone = contactPhone;
      user.accountStatus = accountStatus;
      user.bankName = bankName;
      user.branchName = branchName;
      user.branchCode = branchCode;
      user.accountNumber = accountNumber;
      user.accountHolderName = accountHolderName;
    }
  } catch (err) {
    res.json(err);
  } finally {
    const u = await user.save();
    res.json({
      responseCode: "00",
      status: "success",
      message: "You are successfully update the changes",
      isVisible: true,
      user: u,
    });
  }

});

//=======================================================
// delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const a1 = await user.delete();
    res.json(a1);
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get normal users chart data
router.get("/normal_users/chart_data", async (req, res) => {

  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {

    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const users = await User.find();

    const filteredOnCurrentYear = users.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear && x.userType == "NORMAL_USER";
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = users.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1 && x.userType == "NORMAL_USER";
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
      message: "User details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [
            {name: "User Account Creations", data: previousYearCounts}
          ]
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [
            {name: "User Account Creations", data: currentYearCounts}
          ]
        },      
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

//=======================================================
// get admin users chart data
router.get("/admin_users/chart_data", async (req, res) => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();

  try {

    let currentYearCounts = [];
    let previousYearCounts = [];

    let currentYearTotal;
    let previousYearTotal;

    const users = await User.find();

    const filteredOnCurrentYear = users.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear && x.userType == "ADMIN_USER";
    });

    currentYearTotal = filteredOnCurrentYear.length;

    const filteredOnPreviousYear = users.filter((x) => {
      let jsonDate = new Date(x.createdTime);
      return jsonDate.getFullYear() == currentYear - 1 && x.userType == "ADMIN_USER";
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
      message: "User details chart",
      chartData: [
        {
          year: currentYear - 1,
          total: previousYearTotal,
          data: [
            {name: "Admin Account Creations", data: previousYearCounts}
          ]
        },
        {
          year: currentYear,
          total: currentYearTotal,
          data: [
            {name: "Admin Account Creations", data: currentYearCounts}
          ]
        },      
      ],
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
