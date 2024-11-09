interface KVEntry {
  key: string;
  value: any;
}

interface KVNamespace {
  get(key: string): Promise<KVEntry | null>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(options: { prefix: string }): AsyncIterable<{ key: string }>;
}

interface Context {
  env: {
    NETLIFY_KV: KVNamespace;
  };
}

export default async (request: Request, context: Context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const kv = context.env.NETLIFY_KV;

  try {
    // Root path - provide API information
    if (url.pathname === '/') {
      return new Response(
        JSON.stringify({
          message: 'Play9 Golf API',
          version: '1.0',
          endpoints: {
            test: '/api/test',
            games: '/api/games',
            game: '/api/games/:id'
          }
        }),
        { headers: corsHeaders }
      );
    }

    // Simple test endpoint
    if (url.pathname === '/api/test') {
      return new Response(
        JSON.stringify({ message: 'Edge function is working!' }),
        { headers: corsHeaders }
      );
    }

    // Games endpoints
    if (url.pathname === '/api/games') {
      if (request.method === 'GET') {
        const games: any[] = [];
        const entries = kv.list({ prefix: 'game:' });
        for await (const entry of entries) {
          const game = await kv.get(entry.key);
          if (game?.value) games.push(game.value);
        }
        return new Response(JSON.stringify(games), { headers: corsHeaders });
      }

      if (request.method === 'POST') {
        const game = await request.json();
        await kv.set(`game:${game.id}`, game);
        return new Response(JSON.stringify(game), {
          headers: corsHeaders,
          status: 201
        });
      }
    }

    // Single game endpoint
    if (url.pathname.startsWith('/api/games/')) {
      const gameId = url.pathname.split('/').pop();
      const game = await kv.get(`game:${gameId}`);
      
      if (!game?.value) {
        return new Response(
          JSON.stringify({ error: 'Game not found' }),
          { headers: corsHeaders, status: 404 }
        );
      }

      return new Response(JSON.stringify(game.value), { headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({ 
        error: 'Not found', 
        message: 'The requested endpoint does not exist. Visit / for API documentation.'
      }),
      { headers: corsHeaders, status: 404 }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { headers: corsHeaders, status: 500 }
    );
  }
}
