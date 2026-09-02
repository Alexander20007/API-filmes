const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============ TODOS OS PROVEDORES COM URLs REAIS ============
const providers = [
  {
    id: 'fsharetv',
    name: 'FshareTV',
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://fsharetv.cc/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://fsharetv.cc/'
          }
        });
        if (response.data && response.data.source) {
          return [{
            url: response.data.source,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://fsharetv.io/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://fsharetv.io/'
          }
        });
        if (response.data && response.data.source) {
          return [{
            url: response.data.source,
            quality: response.data.quality || '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'superflix',
    name: 'Superflix',
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://superflix.cc/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://superflix.cc/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'pobreflix',
    name: 'Pobreflix',
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://pobreflix.biz/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://pobreflix.biz/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
            type: 'mp4',
            provider: { id: this.id, name: this.name }
          }];
        }
        return [];
      } catch (e) { return []; }
    }
  },
  {
    id: 'vizinhanca',
    name: 'Vizinhanca',
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://vizinhanca.cc/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://vizinhanca.cc/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://cinevibe.cc/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://cinevibe.cc/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://vidembed.cc/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://vidembed.cc/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://cinehub.ws/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://cinehub.ws/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://moviedb.cc/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://moviedb.cc/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://vidsrc.net/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://vidsrc.net/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
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
    async getSources(movieId) {
      try {
        const response = await axios.get(`https://vixsrc.net/api/movie/${movieId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://vixsrc.net/'
          }
        });
        if (response.data && response.data.url) {
          return [{
            url: response.data.url,
            quality: response.data.quality || '1080p',
            type: 'hls',
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
