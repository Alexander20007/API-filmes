const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============ PROVEDORES QUE FUNCIONAM ============
const providers = [
  {
    id: 'tmdb',
    name: 'TMDB',
    async getSources(movieId) {
      try {
        // Buscar informações do filme no TMDB
        const tmdbKey = process.env.TMDB_API_KEY || '7a081c3d042790632ab0205086acb4ed';
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: tmdbKey,
              append_to_response: 'videos,images'
            }
          }
        );
        
        if (response.data) {
          const movie = response.data;
          // Retornar informações do filme
          return [{
            url: `https://www.themoviedb.org/movie/${movieId}`,
            quality: '1080p',
            type: 'info',
            provider: { id: this.id, name: this.name },
            metadata: {
              title: movie.title,
              overview: movie.overview,
              poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              release_date: movie.release_date,
              vote_average: movie.vote_average
            }
          }];
        }
        return [];
      } catch (e) { 
        return []; 
      }
    }
  },
  {
    id: 'youtube',
    name: 'YouTube Trailers',
    async getSources(movieId) {
      try {
        const tmdbKey = process.env.TMDB_API_KEY || '7a081c3d042790632ab0205086acb4ed';
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          {
            params: {
              api_key: tmdbKey
            }
          }
        );
        
        if (response.data && response.data.results) {
          const trailer = response.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          if (trailer) {
            return [{
              url: `https://www.youtube.com/embed/${trailer.key}`,
              quality: '1080p',
              type: 'embed',
              provider: { id: this.id, name: this.name },
              metadata: {
                title: 'Trailer',
                key: trailer.key
              }
            }];
          }
        }
        return [];
      } catch (e) { 
        return []; 
      }
    }
  },
  {
    id: 'justwatch',
    name: 'JustWatch',
    async getSources(movieId) {
      try {
        // Buscar onde assistir
        const response = await axios.get(
          `https://apis.justwatch.com/content/titles/movie/${movieId}/locale/pt_BR`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );
        
        if (response.data && response.data.offers) {
          const offers = response.data.offers.map(offer => ({
            url: offer.url,
            quality: '1080p',
            type: 'streaming',
            provider: { id: this.id, name: this.name },
            metadata: {
              platform: offer.package_short_name,
              price: offer.monetization_type
            }
          }));
          return offers;
        }
        return [];
      } catch (e) { 
        return []; 
      }
    }
  },
  {
    id: 'omdb',
    name: 'OMDb',
    async getSources(movieId) {
      try {
        // Usar OMDb API (gratuita)
        const response = await axios.get(
          `https://www.omdbapi.com/`,
          {
            params: {
              i: movieId,
              apikey: 'a1b2c3d4' // OMDb requer chave
            }
          }
        );
        
        if (response.data && response.data.Title) {
          return [{
            url: `https://www.imdb.com/title/${movieId}/`,
            quality: '1080p',
            type: 'info',
            provider: { id: this.id, name: this.name },
            metadata: {
              title: response.data.Title,
              year: response.data.Year,
              plot: response.data.Plot,
              rating: response.data.imdbRating
            }
          }];
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
    version: '2.0.0',
    status: 'operational',
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

    // Sempre retornar pelo menos informações do TMDB
    if (allSources.length === 0) {
      // Tentar buscar do TMDB
      try {
        const tmdbKey = process.env.TMDB_API_KEY || '7a081c3d042790632ab0205086acb4ed';
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: tmdbKey
            }
          }
        );
        
        if (response.data) {
          allSources.push({
            url: `https://www.themoviedb.org/movie/${movieId}`,
            quality: '1080p',
            type: 'info',
            provider: { id: 'tmdb_fallback', name: 'TMDB (Fallback)' },
            metadata: {
              title: response.data.title,
              overview: response.data.overview
            }
          });
        }
      } catch (e) {
        // Último recurso
        allSources.push({
          url: `https://www.google.com/search?q=assistir+filme+${movieId}`,
          quality: '720p',
          type: 'search',
          provider: { id: 'fallback', name: 'Google Search' }
        });
      }
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

// Buscar por título
app.get('/v1/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const tmdbKey = process.env.TMDB_API_KEY || '7a081c3d042790632ab0205086acb4ed';
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: tmdbKey,
          query: query,
          language: 'pt-BR'
        }
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
    version: '2.0.0',
    name: 'CinePro',
    description: 'CinePro - Filmes e Séries com TMDB e JustWatch',
    resources: ['stream', 'meta'],
    types: ['movie', 'series'],
    catalogs: [
      {
        type: 'movie',
        id: 'populares',
        name: 'Populares'
      }
    ]
  });
});

// ============ EXPORT ============
exports.handler = serverless(app);
