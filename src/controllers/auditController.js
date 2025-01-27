const Audit = require('../models/auditModel');

exports.listAllAudits = async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};