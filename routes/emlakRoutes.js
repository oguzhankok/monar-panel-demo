const express = require('express');
const router = express.Router();
const Emlak = require('../models/Emlak');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const emlaklar = await Emlak.find().sort({ created_at: -1 });
      res.json(emlaklar);
    } catch (error) { res.status(500).json({ message: error.message }); }
  })
  .post(protect, async (req, res) => {
    try {
      const emlak = await Emlak.create({
        ...req.body,
        ekleyen_kullanici_id: req.user.id,
        ekleyen_kullanici_ad: req.user.ad_soyad
      });
      res.status(201).json(emlak);
    } catch (error) { res.status(400).json({ message: error.message }); }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const emlak = await Emlak.findById(req.params.id);
      if (!emlak) return res.status(404).json({ message: 'Portföy bulunamadı' });

      // BROKER değilse ve portföyün danışmanı/ekleyeni kendisi değilse engelle
      if (req.user.role !== 'ADMİN' && emlak.ilgilenen_danisman_id !== req.user.id && emlak.ekleyen_kullanici_id !== req.user.id) {
        return res.status(403).json({ message: 'Sadece kendi portföyünüzü düzenleyebilirsiniz.' });
      }

      const updatedEmlak = await Emlak.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedEmlak);
    } catch (error) { res.status(400).json({ message: error.message }); }
  })
  .delete(protect, async (req, res) => {
    try {
      const emlak = await Emlak.findById(req.params.id);
      if (!emlak) return res.status(404).json({ message: 'Portföy bulunamadı' });

      // Broker değilse ve portföyün danışmanı/ekleyeni kendisi değilse engelle
      const kendiPortfoyuMu = emlak.ilgilenen_danisman_id === req.user.id || emlak.ekleyen_kullanici_id?.toString() === req.user.id;
      if (req.user.role !== 'ADMİN' && !kendiPortfoyuMu) {
        return res.status(403).json({ message: 'Sadece kendi portföyünüzü silebilirsiniz.' });
      }

      await emlak.deleteOne();
      res.json({ message: 'Emlak başarıyla silindi.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
  });

module.exports = router;