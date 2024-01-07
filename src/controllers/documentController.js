const multer = require('multer');
const upload = multer();
const textProcessor = require('../utils/textProcessor');
const Audit = require('../models/auditModel');
const Document = require('../models/documentModel');
const { sendMail } = require('../utils/mailer');

exports.listAllDocuments = async (req, res) => {
  const { title, keyword, category, fromDate, toDate } = req.query;

  const filter = { deleted: false };

  if (title) {
    filter.title = new RegExp(title, 'i');
  }

  if (category) {
    filter.category = new RegExp(category, 'i');
  }

  if (keyword) {
    filter.keyWords = keyword;
  }

  if (fromDate || toDate) {
    filter['versions.modifiedAt'] = {};

    if (fromDate) {
      filter['versions.modifiedAt'].$gte = new Date(fromDate);
    }

    if (toDate) {
      filter['versions.modifiedAt'].$lte = new Date(toDate);
    }
  }

  try {
    const projection = { file: 0, content: 0 };
    const documents = await Document.find(filter, projection);
    await Audit.create({ userId: req.user._id, username: req.user.username, documentId: req.params.id, action: 'list documents' });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, deleted: false });
    await Audit.create({ userId: req.user._id, username: req.user.username, documentId: req.params.id, action: 'find document' });
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

    const novaVersao = {
      content: extractedText,
      modifiedBy: req.user.username,
      modifiedAt: new Date(),
    };

    const documentData = {
      ...req.body,
      content: extractedText,
      keyWords: keywords,
      versions: [novaVersao],
      file: {
        data: fileData,
        contentType,
        originalName
      }
    };

    const newDocument = await Document.create(documentData);

    await Audit.create({ userId: req.user._id, username: req.user.username, documentId: newDocument._id, action: 'create document' });

    const sanitizedDocument = newDocument.toObject();
    delete sanitizedDocument.file.data;

    res.status(201).json(sanitizedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    const existingDocument = await Document.findById(documentId);
    if (!existingDocument) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    const newBody = req.body;

    if (req.file) {
      const fileData = req.file.buffer;
      const contentType = req.file.mimetype;
      const originalName = req.file.originalname;

      const extractedText = await textProcessor.extractTextFromDocument(fileData, contentType);
      const keywords = await textProcessor.identifyKeywords(extractedText);

      newBody.content = extractedText;
      newBody.keyWords = keywords;
      newBody.file = {
        data: fileData,
        contentType,
        originalName
      };
    }

    const updatedDocument = await Document.findByIdAndUpdate(documentId, { ...newBody }, { new: true });

    const newVersion = {
      content: updatedDocument.content,
      modifiedAt: new Date(),
      modifiedBy: req.user.username,
    };

    updatedDocument.versions.push(newVersion);
    await updatedDocument.save();

    if (req.user.role !== 'admin') {
      await sendMail("Document updated", `A document with id ${req.params.id} was updated.`);
    }

    await Audit.create({ userId: req.user._id, username: req.user.username, documentId: updatedDocument._id, action: 'update document' });

    const sanitizedDocument = updatedDocument.toObject();
    delete sanitizedDocument.file.data;

    res.json(sanitizedDocument);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndUpdate(req.params.id, { deleted: true });
    await Audit.create({ userId: req.user._id, username: req.user.username, documentId: req.params.id, action: 'delete document' });

    if (req.user.role !== 'admin') {
      await sendMail("Document deleted", `A document with id ${req.params.id} was deleted.`);
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadFile = upload.single('file');