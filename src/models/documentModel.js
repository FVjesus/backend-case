const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  keyWords: [String],
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  deleted: { type: Boolean, default: false },
  file: {
    data: Buffer,
    contentType: String,
    originalName: String,
  },
});

module.exports = mongoose.model('Document', documentSchema);