const mongoose = require('mongoose');

const finansIslemSchema = new mongoose.Schema({
  tarih: { type: Date, required: true },
  islem_tipi: { 
    type: String, 
    enum: ['Gelir Faturası', 'Gider Faturası', 'Tahsilat', 'Ödeme', 'Virman'], 
    required: true 
  },
  kategori: { type: String, required: true },
  tutar: { type: Number, required: true },
  aciklama: { type: String },
  
  // İlişkiler
  cari_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cari' },
  cari_unvan: { type: String },
  kasa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kasa' },
  kasa_adi: { type: String },
  hedef_kasa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Kasa' },
  hedef_kasa_adi: { type: String },
  
  ekleyen_kullanici_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ekleyen_kullanici_ad: { type: String }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('FinansIslem', finansIslemSchema);