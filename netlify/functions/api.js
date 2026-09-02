const serverless = require('serverless-http');
const dotenv = require('dotenv');
const { OMSSServer } = require('@omss/framework');

// Carregar variáveis de ambiente
dotenv.config();

// URL é fornecida automaticamente pelo Netlify
const siteUrl = process.env.URL || 'https://alxfilmes.netlify.app';

console.log('🚀 Iniciando CinePro no Netlify');
console.log('📡 URL:', siteUrl);

// Criar servidor com configuração para Netlify
const server = new OMSSServer({
  port: 3000,
  host: '0.0.0.0',
  externalUrl: siteUrl,
  // Desabilitar verificações de host para funcionar no serverless
  disableHostCheck: true
});

// Exportar handler serverless
exports.handler = async (event, context) => {
  console.log('📥 Requisição recebida:', event.path);
  const handler = serverless(server.app);
  return handler(event, context);
};
