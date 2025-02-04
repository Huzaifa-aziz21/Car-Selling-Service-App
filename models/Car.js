const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carModel: { type: String, required: true },
  price: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  maxPictures: { type: Number, required: true },
  images: [String], 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
