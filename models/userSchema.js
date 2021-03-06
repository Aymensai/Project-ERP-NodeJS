const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    etablissement: { type: String, required: true },
    adresse: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture : {type: String, default: 'assets/img/avatars/6.jpg'},
    role: { type: String, default: "User" },
    
    candidatesIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
    resetToken: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResetToken",
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
