import { useState } from 'react';
import {
  Bath,
  CircleCheck,
  HeartHandshake,
  KeyRound,
  Layers,
  Map,
  MessageSquare,
  Sofa,
  Sparkles,
  SprayCan,
  Star,
  Tag,
} from 'lucide-react';
import Modal from '../modal/Modal';
import styles from './ReviewsSection.module.css';

const CATEGORY_ICONS = {
  cleanliness: SprayCan,
  accuracy: CircleCheck,
  checkin: KeyRound,
  communication: MessageSquare,
  location: Map,
  value: Tag,
};

const CHIP_ICONS = {
  comfort: Sofa,
  accuracy: CircleCheck,
  hotTub: Bath,
  condition: Sparkles,
  hospitality: HeartHandshake,
  cleanliness: SprayCan,
  amenities: Layers,
};

export default function ReviewsSection({
  rating,
  reviewCount,
  categories,
  distribution,
  highlights = [],
  reviews,
}) {
  const [open, setOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const total = distribution.reduce((sum, row) => sum + row.count, 0) || 1;

  return (
    <section id="reviews" className={styles.reviewsSection} aria-labelledby="guest-favourite-title">
      <div className={styles.guestFavourite}>
        <div className={styles.laurelRating}>
          <Laurel />
          <p className={styles.largeRating}>{rating}</p>
          <Laurel flip />
        </div>
        <h2 id="guest-favourite-title" className={styles.guestFavouriteTitle}>Guest favourite</h2>
        <p className={styles.guestFavouriteDescription}>
          This home is a guest favourite based on ratings, reviews and reliability
        </p>
        <button type="button" className={styles.howReviewsWork} onClick={() => setHowOpen(true)}>
          How reviews work
        </button>
      </div>

      <div className={styles.ratingBreakdown}>
        <div className={styles.overallRating}>
          <h3 className={styles.categoryTitle}>Overall rating</h3>
          <ul className={styles.bars} aria-label="Rating distribution">
            {distribution.map((row) => (
              <li key={row.stars}>
                <span>{row.stars}</span>
                <span className={styles.track}>
                  <span style={{ width: `${(row.count / total) * 100}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.id] || CircleCheck;
          return (
            <div key={category.id} className={styles.ratingCategory}>
              <h3 className={styles.categoryTitle}>{category.label}</h3>
              <p className={styles.categoryScore}>{category.score.toFixed(1)}</p>
              <Icon className={styles.categoryIcon} size={32} strokeWidth={1.5} aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {highlights.length > 0 && (
        <ul className={styles.reviewCategoryChips} aria-label="Review highlights">
          {highlights.map((chip) => {
            const Icon = CHIP_ICONS[chip.id] || Sparkles;
            return (
              <li key={chip.id} className={styles.reviewChip}>
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                <span className={styles.chipLabel}>{chip.label}</span>
                <span className={styles.chipCount}>{chip.count}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.reviewsGrid}>
        {reviews.slice(0, 4).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <button type="button" className={styles.showAll} onClick={() => setOpen(true)}>
        Show all {reviewCount} reviews
      </button>
      {howOpen && (
        <Modal title="How reviews work" onClose={() => setHowOpen(false)}>
          <p className={styles.howCopy}>
            Guest favourite status is based on ratings, reviews, and reliability. The score shown here
            is the average of {reviewCount} reviews, and each category reflects how guests rated
            cleanliness, accuracy, check-in, communication, location, and value.
          </p>
        </Modal>
      )}
      {open && (
        <Modal title={`${rating} · ${reviewCount} reviews`} onClose={() => setOpen(false)} size="lg">
          <div className={styles.modalGrid}>
            <aside className={styles.modalSummary}>
              <p className={styles.bigRating}>{rating}</p>
              <ul className={styles.modalCategories}>
                {categories.map((category) => (
                  <li key={category.id}>
                    <span>{category.label}</span>
                    <span>{category.score.toFixed(1)}</span>
                  </li>
                ))}
              </ul>
            </aside>
            <div className={styles.modalList}>
              {reviews.map((review) => <ReviewCard key={review.id} review={review} force />)}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Laurel({ flip = false }) {
  return (
    <svg
      className={flip ? `${styles.laurel} ${styles.laurelFlip}` : styles.laurel}
      viewBox="0 0 64 96"
      aria-hidden="true"
    >
      <g fill="none" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M48 10c-8 10-16 26-18 44-1.5 16 3 28 14 34" />
        <path d="M46 18c-9 1-14 8-11 14 6-1 11-5 11-14z" />
        <path d="M41 32c-10 2-15 9-11 15 6-1 12-5 11-15z" />
        <path d="M36 48c-10 2-14 10-9 16 6-1 11-6 9-16z" />
        <path d="M34 64c-8 3-11 11-6 15 5-1 9-6 6-15z" />
        <path d="M36 78c-7 4-8 11-3 14 4-2 7-6 3-14z" />
      </g>
    </svg>
  );
}

function ReviewCard({ review, force = false }) {
  const [expanded, setExpanded] = useState(false);
  const preview = review.preview;
  const hasMore = Boolean(preview && preview !== review.text);
  const text = !force && hasMore && !expanded ? preview : review.text;
  return (
    <article className={styles.card}>
      <header>
        {review.avatar ? (
          <img className={styles.avatar} src={review.avatar} alt="" />
        ) : (
          <span
            className={styles.avatar}
            style={{ background: review.avatarColor || '#ebebeb' }}
            aria-hidden="true"
          >
            {review.name.slice(0, 1)}
          </span>
        )}
        <div>
          <p className={styles.name}>{review.name}</p>
          <p className={styles.meta}>{review.tenure || review.location}</p>
        </div>
      </header>
      <p className={styles.date}>
        <span className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={10}
              fill={index < review.rating ? '#222' : 'none'}
              strokeWidth={1.6}
              aria-hidden="true"
            />
          ))}
        </span>
        <span aria-hidden="true">·</span>
        <span>{review.date}</span>
      </p>
      <p className={styles.text}>{text}</p>
      {!force && hasMore && (
        <button type="button" className={styles.more} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </article>
  );
}
