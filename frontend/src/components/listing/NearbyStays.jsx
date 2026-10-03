import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import ListingImage from '../common/ListingImage';
import { formatINR } from '../../utils/format';
import styles from './NearbyStays.module.css';

const PAGE_SIZE = 5;

const STAYS = [
  {
    id: 'studio-view',
    title: 'Beautiful Studio with a view to die for',
    price: 23600,
    rating: 4.91,
    image: '/images/bedroom-01.jpg',
  },
  {
    id: 'naqab',
    title: 'NAQAB - 1bhk with private pool',
    price: 42218,
    rating: 4.95,
    image: '/images/living-01.jpg',
  },
  {
    id: 'greentique',
    title: 'Greentique Luxury Flat with plunge pool, Calangute',
    price: 44506,
    rating: 4.94,
    image: '/images/living-03.jpg',
  },
  {
    id: 'tropical',
    title: 'The Tropical Studio | 5 mins to Beach',
    price: 22824,
    rating: 4.96,
    image: '/images/living-02.jpg',
  },
  {
    id: 'casa-bella',
    title: 'Luxury Casa Bella 1BHK with plunge pool, Calangute',
    price: 39942,
    rating: 4.95,
    image: '/images/living-04.jpg',
  },
  {
    id: 'pool-apartment',
    title: 'Candolim pool apartment with a sea breeze',
    price: 31450,
    rating: 4.88,
    image: '/images/pool-01.jpg',
  },
  {
    id: 'kitchen-loft',
    title: 'Calangute loft with a full kitchen',
    price: 27900,
    rating: 4.92,
    image: '/images/kitchen-01.jpg',
  },
  {
    id: 'balcony-suite',
    title: 'North Goa balcony suite near the cafés',
    price: 35200,
    rating: 4.9,
    image: '/images/balcony-01.jpg',
  },
  {
    id: 'beach-studio',
    title: 'Beach walk studio, Candolim',
    price: 21750,
    rating: 4.87,
    image: '/images/beach-candolim.jpg',
  },
  {
    id: 'courtyard',
    title: 'Courtyard 1BHK a short ride from the beach',
    price: 38640,
    rating: 4.93,
    image: '/images/resort-exterior.jpg',
  },
];

export default function NearbyStays() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(STAYS.length / PAGE_SIZE);
  const stays = STAYS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className={styles.section} aria-labelledby="nearby-title">
      <div className={styles.head}>
        <h2 id="nearby-title">More stays nearby</h2>
        <div className={styles.pager}>
          <span aria-live="polite">{page + 1} / {pageCount}</span>
          <button
            type="button"
            aria-label="Previous stays"
            disabled={page === 0}
            onClick={() => setPage((current) => current - 1)}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next stays"
            disabled={page === pageCount - 1}
            onClick={() => setPage((current) => current + 1)}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ul className={styles.grid}>
        {stays.map((stay) => (
          <li key={stay.id}>
            <article>
              <div className={styles.photo}>
                <ListingImage src={stay.image} alt="" className={styles.image} />
              </div>
              <h3>{stay.title}</h3>
              <p className={styles.meta}>
                <span>{formatINR(stay.price)}</span>
                <Star size={12} fill="#222" aria-hidden="true" />
                <span>{stay.rating.toFixed(2)}</span>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
