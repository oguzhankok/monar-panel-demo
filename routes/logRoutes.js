const { protect } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const Log = require('../models/logModel');

// Bu rotalara gelen tüm istekleri (GET, POST, PUT, DELETE) koru:
router.use(protect, (req, res, next) => {
  if (req.user && req.user.role === 'ADMİN') {
    next();
  } else {
    return res.status(403).json({ message: 'Bu veriye erişim yetkiniz bulunmamaktadır.' });
  }
});

// Tüm logları getir
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ tarih: -1 }).limit(1000); // Son 1000 işlemi getir
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni log ekle
router.post('/', async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;