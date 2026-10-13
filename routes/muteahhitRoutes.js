const express = require('express');
const router = express.Router();
const Muteahhit = require('../models/Muteahhit');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const muteahhitler = await Muteahhit.find().sort({ created_at: -1 });
      res.json(muteahhitler);
    } catch (error) { res.status(500).json({ message: error.message }); }
  })
  .post(protect, async (req, res) => {
    try {
      const data = { ...req.body };
      // Alan adı senkronizasyonu
      if (data.yetkili_kisi && !data.yetkili_ad_soyad) {
        data.yetkili_ad_soyad = data.yetkili_kisi;
      }
      if (data.yetkili_ad_soyad && !data.yetkili_kisi) {
        data.yetkili_kisi = data.yetkili_ad_soyad;
      }

      const muteahhit = await Muteahhit.create({
        ...data,
        ekleyen_kullanici_id: req.user.id,
        ekleyen_kullanici_ad: req.user.ad_soyad
      });
      res.status(201).json(muteahhit);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const updated = await Muteahhit.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (error) { res.status(400).json({ message: error.message }); }
  })
  .delete(protect, async (req, res) => {
    try {
      await Muteahhit.findByIdAndDelete(req.params.id);
      res.json({ message: 'Müteahhit başarıyla silindi.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
  });

module.exports = router;