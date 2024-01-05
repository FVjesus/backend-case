const express = require('express');
const AuditController = require('../controllers/auditController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const router = express.Router();

router.get('/', authenticate, authorize(['admin']),AuditController.listAllAudits);

module.exports = router;