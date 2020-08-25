const express = require ('express');
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
module.exports = 
passport.use(new BearerStrategy((token, done) => {
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        console.log(err)
        return done(null, false);
      } 
      User.findById(decoded.data._id, (err, user) => {
        if (!user) {
          return done(null, false);
        }
        if (err) {
          return done(null, false);
        }
        return done(null, { user });
      });
    });
  })
);