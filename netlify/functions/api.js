const serverless = require('serverless-http');
const app = require('../../dist/server.js');

exports.handler = serverless(app);
