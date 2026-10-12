const express = require('express');
const router = express.Router();
const Cari = require('../models/Cari');
const { protect } = require('../middleware/authMiddleware');

// Bu rotalara gelen tüm istekleri (GET, POST, PUT, DELETE) koru:
router.use(protect, (req, res, next) => {
  if (req.user && req.user.role === 'ADMİN') {
    next();
  } else {
    return res.status(403).json({ message: 'Bu veriye erişim yetkiniz bulunmamaktadır.' });
  }
});

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const cariler = await Cari.find().sort({ created_at: -1 });
      res.json(cariler);
    } catch (error) { res.status(500).json({ message: error.message }); }
  })
  .post(protect, async (req, res) => {
    try {
      const cari = await Cari.create(req.body);
      res.status(201).json(cari);
    } catch (error) { res.status(400).json({ message: error.message }); }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const cari = await Cari.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(cari);
    } catch (error) { res.status(400).json({ message: error.message }); }
  })
  .delete(protect, async (req, res) => {
    try {
      await Cari.findByIdAndDelete(req.params.id);
      res.json({ message: 'Cari başarıyla silindi.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
  });

module.exports = router;