const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============ TODOS OS PROVEDORES ============
const providers = [
  {
    id: 'fsharetv',
    name: 'FshareTV',
    baseUrl: 'https://fsharetv.cc',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/media/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vidsrc',
    name: 'VidSrc',
    baseUrl: 'https://vidsrc.to',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'hls',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vixsrc',
    name: 'VixSrc',
    baseUrl: 'https://vixsrc.to',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'hls',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'mafiaembed',
    name: 'MafiaEmbed',
    baseUrl: 'https://mafiaembed.com',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vidapi',
    name: 'VidApi',
    baseUrl: 'https://vidapi.com',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vidzee',
    name: 'VidZee',
    baseUrl: 'https://vidzee.cc',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vidnest',
    name: 'VidNest',
    baseUrl: 'https://vidnest.com',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vidrock',
    name: 'VidRock',
    baseUrl: 'https://vidrock.net',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'videasy',
    name: 'Videasy',
    baseUrl: 'https://videasy.com',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'cinevibe',
    name: 'CineVibe',
    baseUrl: 'https://cinevibe.cc',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'fsharetv2',
    name: 'FshareTV 2',
    baseUrl: 'https://fsharetv.io',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/media/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vidembed',
    name: 'VidEmbed',
    baseUrl: 'https://vidembed.cc',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'cinehub',
    name: 'CineHub',
    baseUrl: 'https://cinehub.ws',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'moviedb',
    name: 'MovieDB',
    baseUrl: 'https://moviedb.cc',
    async getSources(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/api/movie/${movieId}`);
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  }
];

// ============ ENDPOINTS ============

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'CinePro',
    version: '1.0.0',
    status: 'operational',
    providers: providers.map(p => p.name),
    endpoints: {
      movie: '/v1/movies/{id}',
      health: '/'
    }
  });
});

// Buscar fontes do filme
app.get('/v1/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const allSources = [];
    const diagnostics = [];

    // Buscar em todos os provedores
    for (const provider of providers) {
      try {
        const sources = await provider.getSources(movieId);
        if (sources && sources.length > 0) {
          allSources.push(...sources);
        }
      } catch (error) {
        diagnostics.push({
          code: 'PROVIDER_ERROR',
          message: `${provider.name}: ${error.message}`,
          severity: 'error'
        });
      }
    }

    // Se não encontrou fontes, usar fallback
    if (allSources.length === 0) {
      allSources.push({
        url: `https://example.com/movie/${movieId}`,
        quality: '720p',
        type: 'mp4',
        provider: { id: 'fallback', name: 'Fallback' }
      });
      diagnostics.push({
        code: 'FALLBACK_MODE',
        message: 'Nenhum provedor retornou resultados, usando fallback',
        severity: 'warning'
      });
    }

    res.json({
      responseId: Date.now().toString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      sources: allSources,
      subtitles: [],
      diagnostics: diagnostics,
      providers_used: providers.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message
    });
  }
});

// Stremio manifest
app.get('/stremio/manifest.json', (req, res) => {
  res.json({
    id: 'org.cinepro',
    version: '1.0.0',
    name: 'CinePro',
    description: 'CinePro - Filmes e Séries com múltiplos provedores',
    resources: ['stream'],
    types: ['movie', 'series'],
    catalogs: []
  });
});

// ============ EXPORT ============
exports.handler = serverless(app);
