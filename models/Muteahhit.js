const mongoose = require('mongoose');

const muteahhitSchema = new mongoose.Schema({
  firma_adi: { type: String, required: true },
  yetkili_kisi: { type: String }, // Frontend ile birebir uyum
  yetkili_ad_soyad: { type: String }, // Geriye dönük uyumluluk
  telefon: { type: String }, // İsteğe bağlı hale getirildi (veya formda zorunlu tutabilirsiniz)
  telefon_ikinci: { type: String },
  email: { type: String },
  bolge: { type: String }, // Frontend'den gelen bölge/ilçe alanı
  calisma_bolgeleri: [{ type: String }],
  aktif_projeler: { type: String }, // Şantiye ve devam eden projeler
  notlar: { type: String }, // İşbirliği notları
  ofis_adresi: { type: String },
  uzmanlik_alani: { type: String },
  aciklama: { type: String },
  ilgilenen_danisman_id: { type: String },
  ekleyen_kullanici_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ekleyen_kullanici_ad: { type: String },
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Muteahhit', muteahhitSchema);