const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  kullanici_id: { type: String, required: true },
  kullanici_ad: { type: String, required: true },
  islem_tipi: { type: String, required: true },
  modul: { type: String, required: true },
  detay: { type: String, required: true },
  tarih: { 
    type: Date, 
    default: Date.now,
    expires: 604800 // SİHİRLİ DOKUNUŞ: 604800 saniye = 7 Gün. (7 gün sonra MongoDB bu veriyi otomatik siler)
  }
});

module.exports = mongoose.model('Log', logSchema);