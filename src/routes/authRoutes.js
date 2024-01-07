const express = require('express');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const AuthController = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     description: Autentica um usuário com base nas credenciais fornecidas
 *     parameters:
 *       - in: formData
 *         name: username
 *         required: true
 *         description: Nome de usuário
 *         schema:
 *           type: string
 *       - in: formData
 *         name: password
 *         required: true
 *         description: Senha do usuário
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Autenticação bem-sucedida, token de acesso retornado
 *         content:
 *           application/json:
 *             example:
 *               token: "659a97040eb50e58bfabe11b"
 *       '401':
 *         description: Credenciais inválidas
 *       '500':
 *         description: Erro interno do servidor
 *
 * /auth/profile:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     description: Retorna o perfil do usuário autenticado
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *     responses:
 *       '200':
 *         description: Perfil do usuário obtido com sucesso
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: "659a946a0eb50e58bfabe116"
 *                 username: "admin"
 *                 password: "$2b$10$CouZ3K.ZRh.Tw50WitXhv.edrXkOnAhkhJrgZOoPc71A4IrBSSZqe"
 *                 role: "admin"
 *                 __v: 0
 *       '401':
 *         description: Não autorizado
 *       '500':
 *         description: Erro interno do servidor
 *
 * /auth/create-user:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário com dados fornecidos
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *       - in: formData
 *         name: username
 *         required: true
 *         description: Nome de usuário do novo usuário
 *         schema:
 *           type: string
 *       - in: formData
 *         name: password
 *         required: true
 *         description: Senha do novo usuário
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
*         content:
 *           application/json:
 *             example:
 *               _id: "659a946a0eb50e58bfabe116"
 *               username: "admin"
 *               password: "$2b$10$CouZ3K.ZRh.Tw50WitXhv.edrXkOnAhkhJrgZOoPc71A4IrBSSZqe"
 *               role: "admin"
 *               __v: 0
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Proibido, permissões insuficientes
 *       '500':
 *         description: Erro interno do servidor
 *
 * /auth/list-users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *     responses:
 *       '200':
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             example:
 *               - _id: "659a946a0eb50e58bfabe116"
 *                 username: "admin"
 *                 role: "admin"
 *                 __v: 0
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Proibido, permissões insuficientes
 *       '500':
 *         description: Erro interno do servidor
 */
router.post('/login', AuthController.login);
router.get('/profile', authenticate, authorize(['user', 'admin']), AuthController.getProfile);
router.post('/create-user', authenticate, authorize(['admin']), AuthController.createUser);
router.get('/list-users', authenticate, authorize(['admin']), AuthController.listAllUsers);

module.exports = router;