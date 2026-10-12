const express = require('express');
const router = express.Router();
const FinansIslem = require('../models/FinansIslem');
const Cari = require('../models/Cari');
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

router.get('/', protect, async (req, res) => {
  try {
    const islemler = await FinansIslem.find().sort({ tarih: -1, created_at: -1 });
    res.json(islemler);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  
  try {
    const data = req.body;
    
    // 1. İşlemi Kaydet
    const islem = await FinansIslem.create({
      ...data,
      ekleyen_kullanici_id: req.user.id,
      ekleyen_kullanici_ad: req.user.ad_soyad
    });

    // 2. Cari Bakiye Güncellemesi
    if (data.cari_id) {
      const c = await Cari.findById(data.cari_id);
      if (c) {
        if (data.islem_tipi === 'Gelir Faturası' || data.islem_tipi === 'Ödeme') c.guncel_bakiye += data.tutar;
        if (data.islem_tipi === 'Gider Faturası' || data.islem_tipi === 'Tahsilat') c.guncel_bakiye -= data.tutar;
        await c.save();
      }
    }

    // 3. Kasa Bakiye Güncellemesi
    if (data.islem_tipi === 'Virman') {
      if (data.kasa_id) await Kasa.findByIdAndUpdate(data.kasa_id, { $inc: { guncel_bakiye: -data.tutar } });
      if (data.hedef_kasa_id) await Kasa.findByIdAndUpdate(data.hedef_kasa_id, { $inc: { guncel_bakiye: data.tutar } });
    } else if (data.kasa_id) {
      const k = await Kasa.findById(data.kasa_id);
      if (k) {
        if (data.islem_tipi === 'Tahsilat') k.guncel_bakiye += data.tutar;
        if (data.islem_tipi === 'Ödeme') k.guncel_bakiye -= data.tutar;
        await k.save();
      }
    }

    res.status(201).json(islem);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const islem = await FinansIslem.findById(req.params.id);
    if (!islem) return res.status(404).json({ message: 'İşlem bulunamadı' });

    // 1. Cari Bakiye İadesi
    if (islem.cari_id) {
      const c = await Cari.findById(islem.cari_id);
      if (c) {
        if (islem.islem_tipi === 'Gelir Faturası' || islem.islem_tipi === 'Ödeme') c.guncel_bakiye -= islem.tutar;
        if (islem.islem_tipi === 'Gider Faturası' || islem.islem_tipi === 'Tahsilat') c.guncel_bakiye += islem.tutar;
        await c.save();
      }
    }

    // 2. Kasa Bakiye İadesi
    if (islem.islem_tipi === 'Virman') {
      if (islem.kasa_id) await Kasa.findByIdAndUpdate(islem.kasa_id, { $inc: { guncel_bakiye: islem.tutar } });
      if (islem.hedef_kasa_id) await Kasa.findByIdAndUpdate(islem.hedef_kasa_id, { $inc: { guncel_bakiye: -islem.tutar } });
    } else if (islem.kasa_id) {
      const k = await Kasa.findById(islem.kasa_id);
      if (k) {
        if (islem.islem_tipi === 'Tahsilat') k.guncel_bakiye -= islem.tutar;
        if (islem.islem_tipi === 'Ödeme') k.guncel_bakiye += islem.tutar;
        await k.save();
      }
    }

    // 3. İşlemi Tamamen Sil
    await islem.deleteOne();
    res.json({ message: 'Finans işlemi silindi ve bakiyeler geri alındı.' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;