const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  
  firstName:  { type: String, required: true },
  lastName: { type: String, required: true },
  adresse :{ type: String, required: true },
  phoneNumber : { type: Number, required: true },
  email:  { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "User" },
  candidatesIds: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  resetToken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestToken",
  },
}, { timestamps: true });


const user=mongoose.model('User',userSchema);
module.exports=user;