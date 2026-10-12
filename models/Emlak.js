const mongoose = require('mongoose');

const emlakSchema = new mongoose.Schema({
  musteri_ad_soyad: { type: String, required: true },
  telefon: { type: String, required: true },
  il: { type: String, required: true },
  ilce: { type: String },
  mahalle: { type: String },
  ana_kategori: { type: String, required: true },
  alt_kategori: { type: String, required: true },
  fiyat: { type: Number },
  min_fiyat: { type: Number }, // <-- YENİ EKLENDİ
  max_fiyat: { type: Number }, // <-- YENİ EKLENDİ
  min_butce: { type: Number },
  max_butce: { type: Number },
  oda_sayisi: { type: String },
  metrekare: { type: Number },
  kullanim_durumu: { type: String },
  imar_durumu: { type: String },
  aciklama: { type: String },
  durum: { type: String, default: 'Portfolyo' },
  ilgilenen_danisman_id: { type: String },
  ekleyen_kullanici_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ekleyen_kullanici_ad: { type: String },
  // React'in çökmesini engelleyen kritik evraklar dizisi
  evraklar: [{
    id: { type: String },
    ad: { type: String },
    url: { type: String },
    tip: { type: String },
    tarih: { type: Date }
  }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Emlak', emlakSchema);