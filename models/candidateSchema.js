const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var candidateSchema = new Schema({
  firstName:  { type: String, },
  lastName: { type: String, },
  adresse :{ type: String, required: true },
  phoneNumber : { type: Number, required: true },
  email:  { type: String, required: true },
  role: { type: String, default: "Candidate" },

}, { timestamps: true });


const candidate=mongoose.model('Candidate',candidateSchema);
module.exports=candidate;