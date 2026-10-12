const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  baslik: { type: String, required: true },
  aciklama: { type: String },
  son_tarih: { type: Date, required: true },
  durum: { 
    type: String, 
    enum: ['Bekliyor', 'Devam Ediyor', 'Tamamlandı'], 
    default: 'Bekliyor' 
  },
  oncelik: { 
    type: String, 
    enum: ['Yüksek', 'Orta', 'Düşük'], 
    default: 'Orta' 
  },
  atanan_kullanici_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  atanan_kullanici_ad: { type: String },
  atayan_kullanici_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  atayan_kullanici_ad: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Task', taskSchema);