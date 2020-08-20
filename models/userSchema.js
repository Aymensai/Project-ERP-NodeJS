const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  etablissement :  { type: String, },
  firstName:  { type: String, },
  lastName: { type: String, },
  adresse :{ type: String, required: true },
  phoneNumber : { type: Number, required: true },
  email:  { type: String, required: true },
  password: { type: String},
  role: { type: String, default: "User" },
  candidatesIds: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resetToken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ResetToken",
  },
}, { timestamps: true });


const user=mongoose.model('User',userSchema);
module.exports=user;