const serverless = require('serverless-http');
const { OMSSServer } = require('@omss/framework');

// Importar o servidor
const server = new OMSSServer();
const app = server.app;

exports.handler = serverless(app);
