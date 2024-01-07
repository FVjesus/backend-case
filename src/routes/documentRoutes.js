const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Lista todos os documentos
 *     description: Retorna uma lista de todos os documentos
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *     responses:
 *       '200':
 *         description: Lista de documentos obtida com sucesso
 *         content:
 *           application/json:
 *             example:
 *               - _id: "659a97060eb50e58bfabe11d"
 *                 title: "Teste palavra chave"
 *                 category: "Petição"
 *                 keyWords: ["6", "9", "3", "18", "dois", "45"]
 *                 deleted: false
 *                 versions:
 *                   - content: "Melhorias necessárias para o 6 construtor, clash of clans. - [X] Casa do construtor nv 9 - [X] Aprimorar 3 construções. - [X] Torre arqueira - [X] Canhão - [X] Morteiro - [X] Morteiro nv8 - [ ] Tropa nv 18 na casa do Construtor - [ ] Upar laboratório - [ ] Defesa nv9 na casa do construtor - [ ] Soma dos níveis dois Herois seja 45"
 *                     modifiedAt: "2024-01-07T12:20:22.164Z"
 *                 createdAt: "2024-01-07T12:20:22.170Z"
 *                 updatedAt: "2024-01-07T17:42:08.585Z"
 *                 __v: 0
 *               - _id: "659a9786016bfc18f37213ac"
 *                 title: "Alteração do arquivo"
 *                 category: "indicação"
 *                 keyWords: ["mi", "mi"]
 *                 deleted: false
 *                 versions:
 *                   - content: "Dados para Transferências: Agência:0001, Conta: 73456191-7 Banco: 0260 Nu Pagamentos S.A CPF:06823675594 Chave PIX: 92603dcb-5038-4f2b-993d-12c2a9261706 Projetos: Gestor-Saúde e Gestor-Almoxarifado (GS e GA) Prestação de Serviço referente ao período 01/09/2023 à 30/09/2023 Dados bancários: Banco: Nu Pagamentos S.A Ag: 0001 Cc: 73456191-7 Codigo Banco: 0260 Nu Pagamentos S.A Tipo da conta: (x) Conta Corrente - ( ) Conta Poupança Pessoa Fisica: (x) Sim ( ) Não. Pessoa Juridica: ( ) Sim (x) Não. Pix: 92603dcb-5038-4f2b-993d-12c2a9261706 CPF: 06823675594 Projetos: Gestor-Saúde e Gestor-Almoxarifado (GS e GA) Período: 01/08/2023 à 31/08/2023"
 *                     modifiedAt: "2024-01-07T12:22:30.496Z"
 *                   - content: "Dados para Transferências: Agência:0001, Conta: 73456191-7 Banco: 0260 Nu Pagamentos S.A CPF:06823675594 Chave PIX: 92603dcb-5038-4f2b-993d-12c2a9261706 Projetos: Gestor-Saúde e Gestor-Almoxarifado (GS e GA) Prestação de Serviço referente ao período 01/09/2023 à 30/09/2023 Dados bancários: Banco: Nu Pagamentos S.A Ag: 0001 Cc: 73456191-7 Codigo Banco: 0260 Nu Pagamentos S.A Tipo da conta: (x) Conta Corrente - ( ) Conta Poupança Pessoa Fisica: (x) Sim ( ) Não. Pessoa Juridica: ( ) Sim (x) Não. Pix: 92603dcb-5038-4f2b-993d-12c2a9261706 CPF: 06823675594 Projetos: Gestor-Saúde e Gestor-Almoxarifado (GS e GA) Período: 01/08/2023 à 31/08/2023"
 *                     modifiedBy: "admin"
 *                     modifiedAt: "2024-01-07T17:43:52.200Z"
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Proibido, permissões insuficientes
 *       '500':
 *         description: Erro interno do servidor
 *
 *   post:
 *     summary: Cria um novo documento
 *     description: Cria um novo documento com dados fornecidos e upload opcional de arquivo
  *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *       - in: formData
 *         name: title
 *         required: true
 *         description: Conteúdo do documento
 *         schema:
 *           type: string
 *       - in: formData
 *         name: category
 *         required: true
 *         description: Conteúdo do documento
 *         schema:
 *           type: string
 *       - in: formData
 *         name: file
 *         description: Arquivo do documento (opcional)
 *         type: file
 *     responses:
 *       '201':
 *         description: Documento criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               title: "Arquivo alte"
 *               content: "(backend OR back-end) AND (dev OR developer OR desenvolvedor) "
 *               category: "Petição"
 *               keyWords: []
 *               deleted: false
 *               file:
 *                 contentType: "text/plain"
 *                 originalName: "linkedinCommand.txt"
 *               versions:
 *                 - content: "(backend OR back-end) AND (dev OR developer OR desenvolvedor) "
 *                   modifiedBy: "admin"
 *                   modifiedAt: "2024-01-07T19:05:25.003Z"
 *               _id: "659af5f5a23abd655c9257a4"
 *               createdAt: "2024-01-07T19:05:25.010Z"
 *               updatedAt: "2024-01-07T19:05:25.010Z"
 *               __v: 0
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Proibido, permissões insuficientes
 *       '500':
 *         description: Erro interno do servidor
 *
 * /api/documents/{id}:
 *   get:
 *     summary: Obtém detalhes de um documento específico
 *     description: Retorna detalhes de um documento com base no ID fornecido
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do documento
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detalhes do documento obtidos com sucesso
 *         content:
 *           application/json:
 *             example:
 *               file:
 *                 data:
 *                   type: "Buffer"
 *                   data: [40, 98, 97, 99]
 *                 contentType: "text/plain"
 *                 originalName: "linkedinCommand.txt"
 *               _id: "659af5f5a23abd655c9257a4"
 *               title: "Arquivo alte"
 *               content: "(backend OR back-end) AND (dev OR developer OR desenvolvedor) "
 *               category: "Petição"
 *               keyWords: []
 *               deleted: false
 *               versions:
 *                 - content: "(backend OR back-end) AND (dev OR developer OR desenvolvedor) "
 *                   modifiedBy: "admin"
 *                   modifiedAt: "2024-01-07T19:05:25.003Z"
 *               createdAt: "2024-01-07T19:05:25.010Z"
 *               updatedAt: "2024-01-07T19:05:25.010Z"
 *               __v: 0
 *       '401':
 *         description: Não autorizado
 *       '500':
 *         description: Erro interno do servidor
 *
 *   put:
 *     summary: Atualiza um documento existente
 *     description: Atualiza um documento existente com dados fornecidos e upload opcional de arquivo
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do documento a ser atualizado
 *         schema:
 *           type: string
 *       - in: formData
 *         name: title
 *         required: true
 *         description: Conteúdo do documento
 *         schema:
 *           type: string
 *       - in: formData
 *         name: file
 *         description: Arquivo do documento (opcional)
 *         type: file
 *     responses:
 *       '200':
 *         description: Documento atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               file:
 *                 data:
 *                   type: "Buffer"
 *                   data: [40, 98, 97, 99]
 *                 contentType: "text/plain"
 *                 originalName: "linkedinCommand.txt"
 *               _id: "659af5f5a23abd655c9257a4"
 *               title: "Arquivo alte"
 *               content: "(backend OR back-end) AND (dev OR developer OR desenvolvedor) "
 *               category: "Petição"
 *               keyWords: []
 *               deleted: false
 *               versions:
 *                 - content: "(backend OR back-end) AND (dev OR developer OR desenvolvedor) "
 *                   modifiedBy: "admin"
 *                   modifiedAt: "2024-01-07T19:05:25.003Z"
 *               createdAt: "2024-01-07T19:05:25.010Z"
 *               updatedAt: "2024-01-07T19:05:25.010Z"
 *               __v: 0
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Proibido, permissões insuficientes
 *       '404':
 *         description: Documento não encontrado
 *       '500':
 *         description: Erro interno do servidor
 *
 *   delete:
 *     summary: Exclui um documento existente
 *     description: Exclui um documento existente com base no ID fornecido
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autorização
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do documento a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Documento excluído com sucesso
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Proibido, permissões insuficientes
 *       '404':
 *         description: Documento não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */

router.get('/documents', authenticate, authorize(['user', 'admin']), documentController.listAllDocuments);
router.get('/documents/:id', authenticate, authorize(['user', 'admin']), documentController.findDocument);
router.post('/documents', authenticate, authorize(['user', 'admin']), documentController.uploadFile, documentController.createDocument);
router.put('/documents/:id', authenticate, authorize(['user', 'admin']), documentController.uploadFile, documentController.updateDocument);
router.delete('/documents/:id', authenticate, authorize(['user', 'admin']), documentController.deleteDocument);

module.exports = router;