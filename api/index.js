import app from '../backend/src/app.js';

function restoreApiPath(req) {
  const url = req.url || '/';
  if (url.startsWith('/api/') || url === '/api') return;

  const forwarded = [
    req.headers['x-vercel-original-url'],
    req.headers['x-forwarded-uri'],
    req.headers['x-invoke-path'],
    req.headers['x-original-url'],
  ].find((value) => typeof value === 'string' && value.startsWith('/api'));

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
