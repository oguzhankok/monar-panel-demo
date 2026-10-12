const mongoose = require('mongoose');

const muteahhitSchema = new mongoose.Schema({
  firma_adi: { type: String, required: true },
  yetkili_ad_soyad: { type: String, required: true },
  telefon: { type: String, required: true },
  telefon_ikinci: { type: String },
  email: { type: String },
  calisma_bolgeleri: [{ type: String }], // Ankara ilçeleri dizisi
  ofis_adresi: { type: String },
  uzmanlik_alani: { type: String }, // Konut, Ticari, Lüks Konut vb.
  aciklama: { type: String },
  ilgilenen_danisman_id: { type: String },
  ekleyen_kullanici_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ekleyen_kullanici_ad: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Muteahhit', muteahhitSchema);