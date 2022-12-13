const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const {createTokens, validateToken} = require('../JWT')

router.get("/", validateToken ,async (req, res) => {
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
        res.json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) res.status(400).json({ error: "User Doesn't Exist" });

  const dbPassword = user.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      res.status(400).json({ error: "Wrong Username or Password" });
    } else {

        const accessToken = createTokens(user)
        res.cookie("access-token", accessToken, {
            maxAge: 60*60*24,
            // for more safty
            httpOnly: true,
        })

      res.json("LOGGED IN");
    }
  });
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
