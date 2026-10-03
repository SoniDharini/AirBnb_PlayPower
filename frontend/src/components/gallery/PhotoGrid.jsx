import ListingImage from '../common/ListingImage';
import styles from './PhotoGrid.module.css';

export default function PhotoGrid({ photos, layout = 'columns', onOpen }) {
  return (
    <div className={`${styles.grid} ${styles[layout] || styles.columns}`}>
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          className={`${styles.tile} ${photo.wide || (layout === 'mosaic' && index === 0) ? styles.wide : ''}`}
          onClick={() => onOpen(photo)}
          aria-label={photo.alt}
        >
          <ListingImage src={photo.url} alt={photo.alt} className={styles.image} />
        </button>
      ))}
    </div>
  );
}
