const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      // Şifreleri (password) dışarı göndermemek için '-password' kullanıyoruz
      const users = await User.find().select('-password').sort({ created_at: -1 });
      res.json(users);
    } catch (error) { res.status(500).json({ message: error.message }); }
  })
  .post(protect, async (req, res) => {
    try {
      const { email } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda.' });

      const user = await User.create(req.body);
      
      // Kaydedilen kullanıcıyı şifresiz geri döndür
      const userWithoutPassword = await User.findById(user._id).select('-password');
      res.status(201).json(userWithoutPassword);
    } catch (error) { res.status(400).json({ message: error.message }); }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      // Şifre güncelleniyorsa özel işlem gerekir, burada sadece yetki/isim güncelliyoruz
      if (req.body.password) {
        const user = await User.findById(req.params.id);
        user.password = req.body.password; // Modeldeki pre('save') bunu kriptolayacak
        user.ad_soyad = req.body.ad_soyad || user.ad_soyad;
        user.role = req.body.role || user.role;
        user.telefon = req.body.telefon || user.telefon;
        await user.save();
        res.json({ message: 'Kullanıcı güncellendi' });
      } else {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(user);
      }
    } catch (error) { res.status(400).json({ message: error.message }); }
  })
  .delete(protect, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'Kullanıcı silindi.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
  });

module.exports = router;