import { OMSSServer } from '@omss/framework';
import serverless from 'serverless-http';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// URL é fornecida automaticamente pelo Netlify
const siteUrl = process.env.URL || 'https://alxfilmes.netlify.app';

console.log('🚀 Iniciando CinePro no Netlify');
console.log('📡 URL:', siteUrl);

// Configuração para o Netlify
const server = new OMSSServer({
  port: 3000,
  host: '0.0.0.0',
  externalUrl: siteUrl,
  disableHostCheck: true
});

// Exportar para o serverless
export const handler = serverless(server.app);
