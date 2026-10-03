import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function readListingFile() {
  const candidates = [
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/listing.json'),
    path.join(process.cwd(), 'backend/src/data/listing.json'),
  ];

  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  throw new Error('Unable to read listing.json');
}

const listings = [JSON.parse(readListingFile())];

export function findListingById(id) {
  return listings.find((listing) => listing.id === id) || null;
}

export function listListings() {
  return listings;
}
