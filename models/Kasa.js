const mongoose = require('mongoose');

const kasaSchema = new mongoose.Schema({
  hesap_adi: { type: String, required: true },
  tip: { type: String, enum: ['Nakit', 'Banka'], required: true },
  banka_adi: { type: String },
  guncel_bakiye: { type: Number, default: 0 },
  aktif_mi: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Kasa', kasaSchema);