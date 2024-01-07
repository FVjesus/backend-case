const express = require('express');
const AuditController = require('../controllers/auditController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const router = express.Router();

/**
 * @swagger
 * /audits:
 *   get:
 *     summary: Lista todas as auditorias
 *     description: Retorna uma lista de todas as auditorias
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *     responses:
 *       '200':
 *         description: Lista de auditorias obtida com sucesso
 *         content:
 *           application/json:
 *             example:
 *               - _id: "659a97040eb50e58bfabe11b"
 *                 userId: "659a946a0eb50e58bfabe116"
 *                 action: "authorize"
 *                 timestamp: "2024-01-07T12:20:20.061Z"
 *               - _id: "659a97060eb50e58bfabe11f"
 *                 userId: "659a946a0eb50e58bfabe116"
 *                 username: "admin"
 *                 documentId: "659a97060eb50e58bfabe11d"
 *                 action: "create document"
 *                 timestamp: "2024-01-07T12:20:22.172Z"
 *       '401':
 *         description: Invalid token
 */

router.get('/', authenticate, authorize(['admin']),AuditController.listAllAudits);

module.exports = router;