const multer = require('multer');
const upload = multer();
const textProcessor = require('../utils/textProcessor');
const Audit = require('../models/auditModel');
const Document = require('../models/documentModel');

exports.listAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ deleted: false });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, deleted: false });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.createDocument = async (req, res) => {
  try {
    const fileData = req.file ? req.file.buffer : null;
    const contentType = req.file ? req.file.mimetype : null;
    const originalName = req.file ? req.file.originalname : null;

    const extractedText = await textProcessor.extractTextFromDocument(fileData, contentType);
    const keywords = await textProcessor.identifyKeywords(extractedText);

    const documentData = { ...req.body, content: extractedText, keyWords: keywords, file: { data: fileData, contentType, originalName } };

    const newDocument = await Document.create(documentData);

    await Audit.create({ userId: req.user._id, username: req.user.username, documentId: newDocument._id, action: 'create' });

    const sanitizedDocument = newDocument.toObject();
    delete sanitizedDocument.file.data;

    res.status(201).json(sanitizedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(req.params.id, { deleted: true }, req.body, { new: true });
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndUpdate(req.params.id, { deleted: true });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadFile = upload.single('file');