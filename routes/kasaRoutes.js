const express = require('express');
const router = express.Router();
const Kasa = require('../models/Kasa');
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
      const kasalar = await Kasa.find().sort({ created_at: -1 });
      res.json(kasalar);
    } catch (error) { res.status(500).json({ message: error.message }); }
  })
  .post(protect, async (req, res) => {
    try {
      const kasa = await Kasa.create(req.body);
      res.status(201).json(kasa);
    } catch (error) { res.status(400).json({ message: error.message }); }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const kasa = await Kasa.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(kasa);
    } catch (error) { res.status(400).json({ message: error.message }); }
  })
  .delete(protect, async (req, res) => {
    try {
      await Kasa.findByIdAndDelete(req.params.id);
      res.json({ message: 'Kasa başarıyla silindi.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
  });

module.exports = router;