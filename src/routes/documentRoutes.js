const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/documents', authenticate, authorize(['user', 'admin']), documentController.listAllDocuments);
router.get('/documents/:id', authenticate, authorize(['user', 'admin']), documentController.findDocument);
router.post('/documents', authenticate, authorize(['user', 'admin']), documentController.uploadFile, documentController.createDocument);
router.put('/documents/:id', authenticate, authorize(['user', 'admin']), documentController.updateDocument);
router.delete('/documents/:id', authenticate, authorize(['user', 'admin']), documentController.deleteDocument);

module.exports = router;