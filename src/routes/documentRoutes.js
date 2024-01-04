const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/documents', documentController.listAllDocuments);
router.post('/documents', documentController.createDocument);
router.put('/documents/:id', documentController.updateDocument);
router.delete('/documents/:id', documentController.deleteDocument);

module.exports = router;