const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const tasks = await Task.find().sort({ son_tarih: 1, created_at: -1 });
      res.json(tasks);
    } catch (error) { res.status(500).json({ message: error.message }); }
  })
  .post(protect, async (req, res) => {
    try {
      const task = await Task.create(req.body);
      res.status(201).json(task);
    } catch (error) { res.status(400).json({ message: error.message }); }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Görev bulunamadı' });

      // Görevi başka biri mi atadı kontrolü
      const baskaBiriMiAtadi = task.atayan_kullanici_id && task.atayan_kullanici_id.toString() !== req.user.id;
      
      // Eğer görevi başkası atamışsa ve güncelleyen kişi ADMİN değilse: Sadece durum güncellenebilir
      if (req.user.role !== 'ADMİN' && baskaBiriMiAtadi) {
        task.durum = req.body.durum || task.durum;
        await task.save();
        return res.json(task);
      }

      // Kendi göreviyse veya Broker ise her şeyi güncelleyebilir
      const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (error) { res.status(400).json({ message: error.message }); }
  })
  .delete(protect, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Görev bulunamadı' });

      // Başkasının atadığı görevi silmeye çalışıyorsa ve ADMİN değilse engelle
      const baskaBiriMiAtadi = task.atayan_kullanici_id && task.atayan_kullanici_id.toString() !== req.user.id;
      if (req.user.role !== 'ADMİN' && baskaBiriMiAtadi) {
        return res.status(403).json({ message: 'Size başkası tarafından atanan görevi silemezsiniz.' });
      }

      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Görev başarıyla silindi.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
  });

module.exports = router;