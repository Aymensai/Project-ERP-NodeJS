  const config = require("../config/config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema")
const bcrypt = require("bcryptjs");
const ResetToken = require("../models/resetTokenSchema");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const express = require("express");
const routerPass = express.Router();

routerPass.post(
  '/resetPassword', async (req, res) =>  {
    if (!req.body.email) {
      return res.status(500).json({ message: "Email is required" });
    }
    // const userGet = await getCollection(req);
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(409).json({ message: "Email does not exist" });
    }

    const resetToken = new ResetToken({
      resetToken: crypto.randomBytes(16).toString("hex"),
      code: Math.floor(Math.random() * 10000),
    });
    const userUpd = await User.findOneAndUpdate(
        { email: req.body.email },
        { resetToken: resetToken._id }
      );
    resetToken.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      User.findOneAndUpdate(
        { email: req.body.email },
        { resetToken: resetToken._id }
      );
    
   
      const transporter = nodemailer.createTransport({
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
        path.resolve("./mail", "forgetPasswordNotification.html"),
        { encoding: "utf8" }
      );
      const username = user.firstName;
      const link = 'http://localhost:4200/#/reset-password/' + resetToken._id;
      const mailParameters = { 
          firstName: username,
          link : link
     };
      const html = ejs.render(mailtemplate, mailParameters);
      // send mail with defined transport object
      let info = transporter.sendMail({
        from: '"Saidane Aymen 👻" <aymensaidane2@gmail.com>',
        to: user.email ,
        subject: "Hello ✔",
        html: html,
      });
        
          res.status(200).send({
            message: "Please check your email !",
            token: resetToken.resetToken,
          });

      });
    
  },

  routerPass.post(
  '/newPassword', async (req, res) =>  {
    ResetToken.findOne({ resetToken: req.body.token }, async function (
      err,
      userToken,
      next
    ) {
      const user = await User.findOne({ resetToken: userToken._id });
      if (!user) {
        return res.status(409).json({ message: "Token has expired" });
      }

      return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Error hashing password" });
        }
        user.password = hash;
        user.save(function (err) {
          if (err) {
            return res
              .status(400)
              .json({ message: "Password can not reset." });
          } else {
            userToken.remove();
            return res
              .status(201)
              .json({ message: "Password reset successfully" });
          }
        });
      });
    });
})
);
module.exports = routerPass;