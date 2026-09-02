const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============ VERIFICAR CHAVE ============
const TMDB_API_KEY = process.env.TMDB_API_KEY;

console.log('🔑 TMDB_API_KEY configurada:', TMDB_API_KEY ? '✅ Sim' : '❌ Não');
console.log('🔑 TMDB_API_KEY:', TMDB_API_KEY ? TMDB_API_KEY.substring(0, 10) + '...' : 'não definida');

// ============ PROVEDORES ============
const providers = [
  {
    id: 'tmdb',
    name: 'TMDB',
    async getSources(movieId) {
      if (!TMDB_API_KEY) {
        console.error('❌ TMDB_API_KEY não está definida!');
        return [];
      }
      
      try {
        console.log(`📡 Buscando filme ${movieId} no TMDB...`);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY,
              language: 'pt-BR',
              append_to_response: 'videos,images'
            },
            timeout: 10000
          }
        );
        
        if (response.data) {
          console.log(`✅ Filme encontrado: ${response.data.title}`);
          return [{
            url: `https://www.themoviedb.org/movie/${movieId}`,
            quality: '1080p',
            type: 'info',
            provider: { id: this.id, name: this.name },
            metadata: {
              title: response.data.title,
              overview: response.data.overview,
              poster: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
              release_date: response.data.release_date,
              vote_average: response.data.vote_average
            }
          }];
        }
        return [];
      } catch (e) {
        console.error(`❌ Erro TMDB: ${e.message}`);
        return [];
      }
    }
  },
  {
    id: 'youtube',
    name: 'YouTube Trailers',
    async getSources(movieId) {
      if (!TMDB_API_KEY) return [];
      
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          {
            params: { api_key: TMDB_API_KEY },
            timeout: 10000
          }
        );
        
        if (response.data && response.data.results) {
          const trailer = response.data.results.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
          );
          if (trailer) {
            return [{
              url: `https://www.youtube.com/embed/${trailer.key}`,
              quality: '1080p',
              type: 'embed',
              provider: { id: this.id, name: this.name },
              metadata: { title: 'Trailer', key: trailer.key }
            }];
          }
        }
        return [];
      } catch (e) {
        return [];
      }
    }
  }
];

// ============ ENDPOINTS ============

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'CinePro',
    version: '3.0.0',
    status: 'operational',
    tmdb_configured: !!TMDB_API_KEY,
    providers: providers.map(p => p.name),
    endpoints: {
      movie: '/v1/movies/{id}',
      search: '/v1/search/{query}',
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

    console.log(`🎬 Buscando filme ID: ${movieId}`);

    // Buscar em todos os provedores
    for (const provider of providers) {
      try {
        const sources = await provider.getSources(movieId);
        if (sources && sources.length > 0) {
          allSources.push(...sources);
          console.log(`✅ ${provider.name}: ${sources.length} fonte(s)`);
        } else {
          console.log(`❌ ${provider.name}: nenhuma fonte`);
        }
      } catch (error) {
        diagnostics.push({
          code: 'PROVIDER_ERROR',
          message: `${provider.name}: ${error.message}`,
          severity: 'error'
        });
      }
    }

    // Se não encontrou nada, usar TMDB como fallback
    if (allSources.length === 0 && TMDB_API_KEY) {
      try {
        console.log(`🔄 Tentando TMDB como fallback...`);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY,
              language: 'pt-BR'
            },
            timeout: 10000
          }
        );
        
        if (response.data) {
          allSources.push({
            url: `https://www.themoviedb.org/movie/${movieId}`,
            quality: '1080p',
            type: 'info',
            provider: { id: 'tmdb_fallback', name: 'TMDB' },
            metadata: {
              title: response.data.title,
              overview: response.data.overview,
              poster: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`
            }
          });
          console.log(`✅ Fallback TMDB funcionou!`);
        }
      } catch (e) {
        console.error(`❌ Fallback TMDB falhou: ${e.message}`);
      }
    }

    // Último recurso
    if (allSources.length === 0) {
      allSources.push({
        url: `https://www.google.com/search?q=assistir+filme+${movieId}`,
        quality: '720p',
        type: 'search',
        provider: { id: 'fallback', name: 'Google Search' }
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
      providers_used: providers.length,
      tmdb_configured: !!TMDB_API_KEY
    });

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    res.status(500).json({
      error: 'Erro ao processar requisição',
      message: error.message
    });
  }
});

// Buscar por título
app.get('/v1/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: 'TMDB_API_KEY não configurada' });
    }
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          language: 'pt-BR'
        },
        timeout: 10000
      }
    );
    
    res.json({
      results: response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        release_date: movie.release_date
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stremio manifest
app.get('/stremio/manifest.json', (req, res) => {
  res.json({
    id: 'org.cinepro',
    version: '3.0.0',
    name: 'CinePro',
    description: 'CinePro - Filmes e Séries com TMDB',
    resources: ['stream', 'meta'],
    types: ['movie', 'series'],
    catalogs: []
  });
});

// ============ EXPORT ============
exports.handler = serverless(app);
