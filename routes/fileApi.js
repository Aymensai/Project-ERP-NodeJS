const path = require("path");
const multer = require("multer");
const express = require("express");
const uploadPicture = express.Router();
const File = require("../models/fileSchema");
const passport = require("passport");
const Etablissement = require("../models/userSchema");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

uploadPicture.post(
  "/uploadfile",
  passport.authenticate("bearer", { session: false }),
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
  }
);

uploadPicture.post(
  "/uploadphoto",
  passport.authenticate("bearer", { session: false }),
  upload.single("picture"),
  (req, res, next) => {
    File.create(req.body)
      .then(function (file) {
        if (!file) {
          const error = new Error("Please upload a file");
          error.httpStatusCode = 400;
          return next(error);
        }
        res.send(file);
      })
      .catch(next);
  }
);

uploadPicture.get(
  "/photos",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const files = await File.find();
    res.send(files);
  }
);

uploadPicture.get(
  "/photo/:id",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    File.findByIdAndUpdate({ _id: req.params.id }, req.body).then((file) => {
      res.send(file);
    });
  }
);

uploadPicture.post(
  "/upload/:id",
  upload.single("picture"),
  (req, res) => {
    if (!req.file) return res.send({ message: "Please upload a file" });
    else {
      const link = "http://localhost:3000/upload/" + req.file.filename;
      return Etablissement.findByIdAndUpdate(
        req.params.id,
        { $set: { picture : link } },
        (err, resultat) => {
          if (err) {
            res.send(err);
          }
          Etablissement.findById(req.params.id,(err,resultat2)=>{
                    res.send(resultat2);
                    
                });
        }
      );
    }
  }
  );
module.exports = uploadPicture;