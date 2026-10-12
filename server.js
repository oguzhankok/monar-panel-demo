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
    const User = require('./models/User'); // User modelinizin yolu
    const bcrypt = require('bcryptjs'); // veya require('bcrypt')

    const demoUsers = [
      {
        ad_soyad: 'Demo Broker',
        email: 'broker@remax-monar.com',
        password: 'demo123',
        role: 'ADMİN'
      },
      {
        ad_soyad: 'Demo Ofis',
        email: 'ofis@remax-monar.com',
        password: 'demo123',
        role: 'HALF-ADMİN'
      },
      {
        ad_soyad: 'Demo Danışman',
        email: 'danisman@remax-monar.com',
        password: 'demo123',
        role: 'MEMBER'
      }
    ];

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        // NOT: Eğer models/User.js dosyanızda pre('save') ile şifre otomatik hashleniyorsa
        // doğrudan User.create(u) yapabilirsiniz. Eğer hashlenmiyorsa alttaki satır hashler:
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({
          ...u,
          password: hashedPassword
        });
        console.log(`✅ Demo kullanıcı oluşturuldu: ${u.email} (${u.role})`);
      }
    }
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