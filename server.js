const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Gelen istekleri okuma ve güvenlik izinleri
app.use(cors());
app.use(express.json());

// Rotaları İçeri Aktarma
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const emlakRoutes = require('./routes/emlakRoutes');
const cariRoutes = require('./routes/cariRoutes');
const kasaRoutes = require('./routes/kasaRoutes');
const finansRoutes = require('./routes/finansRoutes');
const taskRoutes = require('./routes/taskRoutes');
const logroutes = require('./routes/logRoutes');
const muteahhitRoutes = require ('./routes/muteahhitRoutes');
// Rotaları Kullanma (Endpoint tanımlamaları)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/emlak', emlakRoutes);
app.use('/api/cari', cariRoutes);
app.use('/api/kasa', kasaRoutes);
app.use('/api/finans', finansRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logroutes);
app.use('/api/muteahhitler', muteahhitRoutes);

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Bağlantısı Başarılı!'))
  .catch((err) => console.error('❌ MongoDB Bağlantı Hatası:', err));
const seedDemoUsers = async () => {
  try {
    const User = require('./models/User'); // User model yolunuz
    const bcrypt = require('bcryptjs'); // veya 'bcrypt'

    // 1. Varsa eski/hatalı demo kullanıcıları tamamen temizle
    const demoEmails = [
      'broker@remax-monar.com',
      'ofis@remax-monar.com',
      'danisman@remax-monar.com'
    ];
    await User.deleteMany({ email: { $in: demoEmails } });

    // 2. Şifreyi tek sefer hashle
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const demoUsers = [
      {
        ad_soyad: 'Demo Broker',
        email: 'broker@remax-monar.com',
        password: hashedPassword,
        role: 'ADMİN'
      },
      {
        ad_soyad: 'Demo Ofis',
        email: 'ofis@remax-monar.com',
        password: hashedPassword,
        role: 'HALF-ADMİN'
      },
      {
        ad_soyad: 'Demo Danışman',
        email: 'danisman@remax-monar.com',
        password: hashedPassword,
        role: 'MEMBER'
      }
    ];

    // insertMany kullanılır; insertMany pre('save') hook'unu tetiklemez, çift hashlemeyi önler
    await User.insertMany(demoUsers);
    console.log('✅ 3 Demo kullanıcı başarıyla sıfırlandı ve oluşturuldu.');
  } catch (error) {
    console.error('Demo kullanıcı oluşturma hatası:', error.message);
  }
};

// MongoDB bağlantısı başarılı olduğu anda çağırın:
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Bağlandı');
    seedDemoUsers(); // Demo kullanıcıları oluştur
  })
  .catch((err) => {
    console.error('MongoDB Bağlantı Hatası:', err);
  });
// Ana Test Rotası
const path = require('path');

// 1. Rotalar yukarıda tanımlı ( /api/auth, /api/emlak vs. )

// 2. Frontend Statik Dosyalarını Sunma
app.use(express.static(path.join(__dirname, 'dist')));

// 3. SPA Fallback (API rotaları dışındaki tüm ana sayfa ve alt sayfa isteklerini React/Vite index.html'e yönlendir)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// Sunucuyu Başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda ayaklandı.`);
});