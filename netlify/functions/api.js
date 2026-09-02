const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Criar app Express diretamente
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'CinePro',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      movie: '/v1/movies/{id}',
      tv: '/v1/tv/{id}/seasons/{s}/episodes/{e}',
      health: '/'
    }
  });
});

// Rota de filmes (simplificada)
app.get('/v1/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    
    // Tenta importar o OMSSServer dinamicamente
    let OMSSServer;
    try {
      const module = await import('@omss/framework');
      OMSSServer = module.OMSSServer;
    } catch (e) {
      console.log('⚠️ OMSSServer não disponível, usando fallback');
    }
    
    if (OMSSServer) {
      const server = new OMSSServer({
        port: 3000,
        host: '0.0.0.0',
        externalUrl: process.env.URL || 'https://alxfilmes.netlify.app',
        disableHostCheck: true
      });
      
      // Delegar para o servidor OMSS
      return server.app(req, res);
    }
    
    // Fallback: retornar dados de exemplo
    res.json({
      responseId: 'fallback-' + Date.now(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      sources: [
        {
          url: `https://example.com/movie/${movieId}`,
          quality: '1080p',
          type: 'mp4',
          provider: { id: 'example', name: 'Example Provider' }
        }
      ],
      subtitles: [],
      diagnostics: [
        {
          code: 'FALLBACK_MODE',
          message: 'Usando modo fallback - OMSSServer não disponível',
          severity: 'warning'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message
    });
  }
});

// Rota para Stremio
app.get('/stremio/manifest.json', (req, res) => {
  res.json({
    id: 'org.cinepro',
    version: '1.0.0',
    name: 'CinePro',
    description: 'CinePro - Filmes e Séries',
    resources: ['stream'],
    types: ['movie', 'series'],
    catalogs: []
  });
});

// Exportar handler
exports.handler = serverless(app);
