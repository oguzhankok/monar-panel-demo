const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token Oluşturucu Fonksiyon
const generateToken = (id, role, ad_soyad) => {
  return jwt.sign({ id, role, ad_soyad }, process.env.JWT_SECRET, { expiresIn: '7d' }); // 7 gün geçerli
};

// ==========================================
// 1. GİRİŞ YAP (LOGIN)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }

    const isMatch = await user.matchPassword(password);

    if (user && isMatch) {
      res.json({
        id: user._id,
        ad_soyad: user.ad_soyad,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role, user.ad_soyad)
      });
    } else {
      res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// ==========================================
// 2. İLK KURULUM (Sisteme admin ekleme arka kapısı)
// ==========================================
router.post('/setup', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: 'remaxmonar@gmail.com' });
    if (userExists) {
      return res.status(400).json({ message: 'Yönetici zaten mevcut.' });
    }
    const existingUser = await User.findOne({ email: 'demo@panel.com' });
    // Şifre arka planda otomatik olarak hash'lenip (kriptolanıp) kaydedilecek
    const user = await User.create({
      ad_soyad: 'Demo Yöneticisi',
      email: 'demo@panel.com',
      password: 'demo123Password!',
      role: 'ADMIN'
    });

    res.status(201).json({ message: 'İlk yönetici başarıyla oluşturuldu!' });
  } catch (error) {
    res.status(500).json({ message: 'Kurulum hatası' });
  }
});

module.exports = router;