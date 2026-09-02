const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;

console.log('🔑 TMDB_API_KEY:', TMDB_API_KEY ? '✅ Configurada' : '❌ Não configurada');

// ============ PROVEDORES ============
const providers = [
  {
    id: 'tmdb',
    name: 'TMDB Info',
    async getSources(movieId) {
      try {
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
          return [{
            url: `https://www.themoviedb.org/movie/${movieId}`,
            quality: '1080p',
            type: 'info',
            provider: { id: this.id, name: this.name },
            metadata: {
              title: response.data.title,
              overview: response.data.overview,
              poster: `https://image.tmdb.org/t/p/w500${response.data.poster_path}`,
              release_date: response.data.release_date
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
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          {
            params: { api_key: TMDB_API_KEY }
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
              metadata: { title: 'Trailer' }
            }];
          }
        }
        return [];
      } catch (e) {
        return [];
      }
    }
  },
  // ============ FILMES COMPLETOS ============
  {
    id: 'superflix',
    name: 'Superflix (Filme Completo)',
    async getSources(movieId) {
      try {
        const tmdbResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY
            }
          }
        );
        
        const title = tmdbResponse.data.title;
        const year = tmdbResponse.data.release_date?.split('-')[0] || '';
        
        // Gerar link do Superflix
        const url = `https://superflix.cc/${title.replace(/ /g, '-').toLowerCase()}-${year}`;
        
        return [{
          url: url,
          quality: '1080p',
          type: 'movie',
          provider: { id: this.id, name: this.name },
          metadata: {
            title: title,
            year: year,
            note: '✅ Clique para assistir o filme completo!'
          }
        }];
      } catch (e) {
        return [];
      }
    }
  },
  {
    id: 'pobreflix',
    name: 'Pobreflix (Filme Completo)',
    async getSources(movieId) {
      try {
        const tmdbResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY
            }
          }
        );
        
        const title = tmdbResponse.data.title;
        const year = tmdbResponse.data.release_date?.split('-')[0] || '';
        
        const url = `https://pobreflix.biz/${title.replace(/ /g, '-').toLowerCase()}-${year}`;
        
        return [{
          url: url,
          quality: '1080p',
          type: 'movie',
          provider: { id: this.id, name: this.name },
          metadata: {
            title: title,
            year: year,
            note: '✅ Clique para assistir o filme completo!'
          }
        }];
      } catch (e) {
        return [];
      }
    }
  },
  {
    id: 'vizinhanca',
    name: 'Vizinhanca (Filme Completo)',
    async getSources(movieId) {
      try {
        const tmdbResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY
            }
          }
        );
        
        const title = tmdbResponse.data.title;
        const year = tmdbResponse.data.release_date?.split('-')[0] || '';
        
        const url = `https://vizinhanca.cc/${title.replace(/ /g, '-').toLowerCase()}-${year}`;
        
        return [{
          url: url,
          quality: '1080p',
          type: 'movie',
          provider: { id: this.id, name: this.name },
          metadata: {
            title: title,
            year: year,
            note: '✅ Clique para assistir o filme completo!'
          }
        }];
      } catch (e) {
        return [];
      }
    }
  },
  {
    id: 'cinevibe',
    name: 'CineVibe (Filme Completo)',
    async getSources(movieId) {
      try {
        const tmdbResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY
            }
          }
        );
        
        const title = tmdbResponse.data.title;
        const year = tmdbResponse.data.release_date?.split('-')[0] || '';
        
        const url = `https://cinevibe.cc/${title.replace(/ /g, '-').toLowerCase()}-${year}`;
        
        return [{
          url: url,
          quality: '1080p',
          type: 'movie',
          provider: { id: this.id, name: this.name },
          metadata: {
            title: title,
            year: year,
            note: '✅ Clique para assistir o filme completo!'
          }
        }];
      } catch (e) {
        return [];
      }
    }
  },
  {
    id: 'vixsrc',
    name: 'VixSrc (Filme Completo)',
    async getSources(movieId) {
      try {
        return [{
          url: `https://vixsrc.net/embed/movie/${movieId}`,
          quality: '1080p',
          type: 'embed',
          provider: { id: this.id, name: this.name },
          metadata: {
            note: '✅ Clique para assistir o filme completo!'
          }
        }];
      } catch (e) {
        return [];
      }
    }
  },
  {
    id: 'vidsrc',
    name: 'VidSrc (Filme Completo)',
    async getSources(movieId) {
      try {
        return [{
          url: `https://vidsrc.net/embed/movie/${movieId}`,
          quality: '1080p',
          type: 'embed',
          provider: { id: this.id, name: this.name },
          metadata: {
            note: '✅ Clique para assistir o filme completo!'
          }
        }];
      } catch (e) {
        return [];
      }
    }
  }
];

// ============ ENDPOINTS ============

app.get('/', (req, res) => {
  res.json({
    name: 'CinePro',
    version: '4.0.0',
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

    if (allSources.length === 0) {
      allSources.push({
        url: `https://www.google.com/search?q=assistir+filme+${movieId}`,
        quality: '720p',
        type: 'search',
        provider: { id: 'fallback', name: 'Google Search' }
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

// Buscar por título
app.get('/v1/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: TMDB_API_KEY,
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
    version: '4.0.0',
    name: 'CinePro',
    description: 'CinePro - Filmes, Trailers e informações',
    resources: ['stream', 'meta'],
    types: ['movie', 'series'],
    catalogs: []
  });
});

exports.handler = serverless(app);
