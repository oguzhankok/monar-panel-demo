const mongoose = require('mongoose');

const cariSchema = new mongoose.Schema({
  unvan: { type: String, required: true },
  tip: { type: String, enum: ['Müşteri', 'Tedarikçi', 'Personel', 'Broker','Danışman'], required: true },
  telefon: { type: String },
  email: { type: String },
  adres: { type: String },
  guncel_bakiye: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Cari', cariSchema);