  
const express = require("express");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const routerMail = express.Router();
const passport = require("passport");
const candidateSchema = require("../models/candidateSchema");
const candidate = require("../models/candidateSchema");
routerMail.post(
  "/sendMail",
  passport.authenticate("bearer", { session: false }),
  async (req, res, next) => {
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
    
    
    candidateSchema.find().then((candidates)=>{
      if (candidates!=null && candidates!=undefined && candidates.length > 0) {
        candidates.forEach((candidate)=>{
        
         
          // send mail with defined transport object
          let info =  transporter.sendMail({
            from: '"Saidane Aymen 👻" <aymensaidane2@gmail.com>',
            to: candidate.email,
            subject: req.body.subject,
            text: req.body.content,
          });

        });
        res.send({ message: "the email is sent!" });
      }
    });
 
   
    
  }
);

module.exports = routerMail;