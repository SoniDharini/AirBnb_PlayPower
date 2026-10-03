import { Star } from 'lucide-react';
import styles from './PropertySummary.module.css';

export default function PropertySummary({ listing }) {
  const facts = [
    `${listing.maxGuests} guests`,
    `${listing.bedrooms} bedroom`,
    `${listing.beds} bed`,
    `${listing.bathrooms} bathroom`,
  ];

  const openReviews = () => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className={styles.summary} aria-labelledby="summary-title">
      <div className={styles.top}>
        <div>
          <h2 id="summary-title">{listing.propertyType} in {listing.location}</h2>
          <p className={styles.facts}>{facts.join(' · ')}</p>
        </div>
      </div>
      <div className={styles.favourite}>
        <div className={styles.laurels}>
          <Laurel />
          <p>Guest favourite</p>
          <Laurel flip />
        </div>
        <p className={styles.loved}>One of the most loved homes on Airbnb, according to guests</p>
        <button type="button" className={styles.score} onClick={openReviews}>
          <strong>{listing.rating}</strong>
          <span className={styles.starRow} aria-label={`${listing.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={10} fill="#222" color="#222" aria-hidden="true" />
            ))}
          </span>
        </button>
        <span className={styles.vRule} aria-hidden="true" />
        <button type="button" className={styles.count} onClick={openReviews}>
          <strong>{listing.reviewCount}</strong>
          <span>Reviews</span>
        </button>
      </div>
      <div className={styles.host}>
        <span className={styles.avatar} aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="#1b4332" />
            <text x="24" y="26.5" textAnchor="middle" fill="#fff" fontSize="5.4" fontWeight="700" letterSpacing="0.3">
              MIRASHYA
            </text>
          </svg>
        </span>
        <div>
          <p className={styles.hostName}>Hosted by {listing.host.name}</p>
          <p className={styles.hostMeta}>{listing.host.hostingYears} years hosting</p>
        </div>
      </div>
    </section>
  );
}

function Laurel({ flip = false }) {
  return (
    <svg className={flip ? `${styles.laurel} ${styles.laurelFlip}` : styles.laurel} viewBox="0 0 28 48" aria-hidden="true">
      <g fill="none" stroke="#222" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4c-6 6-10 16-10 26 0 6 2 10 6 14" />
        <path d="M20 8c-5 1-8 4-6 8 3-1 6-3 6-8z" />
        <path d="M17 18c-5 1-8 5-5 8 3 0 6-3 5-8z" />
        <path d="M15 28c-4 1-6 5-3 8 3 0 5-3 3-8z" />
        <path d="M15 36c-3 2-4 5-2 7 2-1 3-3 2-7z" />
      </g>
    </svg>
  );
}
