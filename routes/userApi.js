const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/userSchema");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
require("../DataBase/passport");

router.get("/users",  passport.authenticate("bearer", { session: false }),
async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

router.get("/users/:id", passport.authenticate("bearer", { session: false }),
 async (req, res, next) => {
  const users = await User.findById(req.params.id);
  res.send(users);
});

router.post("/users", passport.authenticate("bearer", { session: false }), 
async (req, res, next) => {
  User.create(req.body)
    .then(function (user) {
      res.send(user);
    })
    .catch(next);
});

router.put("/users/:id", passport.authenticate("bearer", { session: false }),
(req, res, next) => {
  User.findByIdAndUpdate({ _id: req.params.id }, req.body).then((user) => {
    res.send(user);
  });
});

router.delete("/users/:id", passport.authenticate("bearer", { session: false }),
(req, res, next) => {
  User.findByIdAndRemove({ _id: req.params.id }).then((user) => {
    res.send(user);
  });
});

router.post("/affect/:idEtablissement/:idCandidate", passport.authenticate("bearer", { session: false }),
async (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.params.idEtablissement },
    { $push: { candidatesIds: req.params.idCandidate } }
  ).then((user) => {
    res.send(user);
  });
});

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  const unique = await User.findOne({ email: req.body.email });
  if (unique) return res.status(400).send({ message: "Email already in use, Please use another email!" });

  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // begin send mail 
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aymensaidane2@gmail.com",
      pass: "hidesoak595749",
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailtemplate = fs.readFileSync(
    path.resolve("./mail", "mailNotification.html"),
    { encoding: "utf8" }
  );
   
  const mailParameters = { firstName: user.firstName };
  const html = ejs.render(mailtemplate, mailParameters);
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Saidane Aymen 👻" <aymensaidane2@gmail.com>',
    to: user.email,
    subject: "Welcome To My ERP ✔",
    html: html,
  });
  //end send mail
  res.send(user);
});
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.send("wrong email or password");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.send("wrong email or password");
  {
    let token = jwt.sign(
      {
        data: {
          _id: user._id,
          email: user.email,
          role: user.role
        },
      },
      "secret", { expiresIn: '1d' }
    );

    res.send({ token: token });
  }

});

module.exports = router;