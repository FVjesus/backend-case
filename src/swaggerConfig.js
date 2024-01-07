const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend case',
      version: '1.0.0',
      description: 'Documentação da API',
    },
  },
  apis: ['src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;