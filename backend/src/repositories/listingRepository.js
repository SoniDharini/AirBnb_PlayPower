import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/listing.json');
const listings = [JSON.parse(readFileSync(dataPath, 'utf8'))];

export function findListingById(id) {
  return listings.find((listing) => listing.id === id) || null;
}

export function listListings() {
  return listings;
}
