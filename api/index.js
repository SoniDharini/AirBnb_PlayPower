import app from '../backend/src/app.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function headerValue(req, name) {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function restoreApiPath(req) {
  const url = req.url || '/';
  if (url.startsWith('/api/') || url === '/api') return;

  const forwarded = [
    'x-vercel-original-url',
    'x-forwarded-uri',
    'x-invoke-path',
    'x-original-url',
    'x-vercel-original-path',
  ]
    .map((name) => headerValue(req, name))
    .find((value) => typeof value === 'string' && value.startsWith('/api'));

  if (forwarded) {
    req.url = forwarded;
    return;
  }

  const queryIndex = url.indexOf('?');
  const path = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : url.slice(queryIndex);
  const suffix = path.startsWith('/') ? path : `/${path}`;
  req.url = `/api${suffix === '/' ? '' : suffix}${query}`;
}

export default function handler(req, res) {
  restoreApiPath(req);
  return app(req, res);
}
