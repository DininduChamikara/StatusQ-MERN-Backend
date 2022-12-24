const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("../JWT");

router.get("/", validateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    res.json({
      responseCode: "1000",
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
        state: req.body.state,
      })
        .then(() => {
          // res.json("USER REGISTERED");
          res.json({
            responseCode: "00",
            status: "success",
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      // error: "User Doesn't Exist"
      responseCode: "1000",
      status: "failure",
      message: "Invalid Username or Password",
    });
  } else {
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then((match) => {
      if (!match) {
        res.status(400).json({
          // error: "Wrong Username or Password"
          responseCode: "1000",
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
          message: "You are logged successfully",
          user: user,
        });
      }
    });
  }
});

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
      user: u,
    });
  }

  // let user = await User.findById({userId})
});

// router.patch('/:id', async(req, res) => {
//     try{
//         const user = await User.findById(req.params.id)
//         alien.sub = req.body.sub
//         const a1 = await alien.save()
//         res.json(a1)
//     }catch(err){
//         res.send('Error ' + err)
//     }
// })

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const a1 = await user.delete();
    res.json(a1);
  } catch (err) {
    res.send("Error " + err);
  }
});

module.exports = router;
