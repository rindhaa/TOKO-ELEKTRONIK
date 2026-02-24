// src/swagger/swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;
const hostUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Toko Elektronik',
      version: '1.0.0',
      description: 'Dokumentasi API untuk manajemen toko elektronik (Admin, Kasir, Customer)',
    },
    servers: [{ url: hostUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/swagger/*.js'], // <- baca semua file swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
