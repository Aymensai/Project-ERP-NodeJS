const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/candidateSchema");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const passport = require("passport");
require("../DataBase/passport");


router.get("/candidate",  passport.authenticate("bearer", { session: false }),
async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

router.get("/candidate/:id", passport.authenticate("bearer", { session: false }),
 async (req, res, next) => {
  const users = await User.findById(req.params.id);
  res.send(users);
});

router.post("/candidate", passport.authenticate("bearer", { session: false }),
async (req, res, next) => {
  User.create(req.body)
    .then(function (user) {
      res.send(user);
    })
    .catch(next);
});

router.put("/candidate/:id", passport.authenticate("bearer", { session: false }),
(req, res, next) => {
  User.findByIdAndUpdate({ _id: req.params.id }, req.body).then((user) => {
    res.send(user);
  });
});

router.delete("/candidate/:id", passport.authenticate("bearer", { session: false }),
(req, res, next) => {
  User.findByIdAndRemove({ _id: req.params.id }).then((user) => {
    res.send(user);
  });
});






module.exports = router;