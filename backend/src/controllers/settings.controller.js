const Settings = require('../models/Settings');

const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
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
};

module.exports = { getSettings, updateSettings };
