const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ storeName: 'NovaPOS', invoicePrefix: 'INV', nextInvoiceNumber: 1001 });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

router.put('/', requireRole('OWNER'), async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
