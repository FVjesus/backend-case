const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    modifiedBy: { type: String },
    modifiedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  keyWords: [String],
  deleted: { type: Boolean, default: false },
  file: {
    data: Buffer,
    contentType: String,
    originalName: String,
  },
  versions: [versionSchema],

}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);