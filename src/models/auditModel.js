const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  documentId: mongoose.Schema.Types.ObjectId,
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Audit', auditSchema);
