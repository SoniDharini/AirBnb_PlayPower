import { LayoutGrid } from 'lucide-react';
import ListingImage from '../common/ListingImage';
import styles from './HeroGallery.module.css';

export default function HeroGallery({ photos, onOpenPhoto, onShowAll }) {
  return (
    <section className={styles.gallery} aria-label="Photo gallery">
      <div className={styles.main}>
        <PhotoTile photo={photos[0]} index={0} total={photos.length} eager onOpen={onOpenPhoto} />
      </div>
      <div className={styles.grid}>
        {photos.slice(1, 5).map((photo, index) => (
          <div key={photo.id} className={styles.cell}>
            <PhotoTile
              photo={photo}
              index={index + 1}
              total={photos.length}
              eager={index < 2}
              onOpen={onOpenPhoto}
            />
            {index === 3 && (
              <button type="button" className={styles.showAll} onClick={onShowAll}>
                <LayoutGrid size={16} strokeWidth={2} aria-hidden="true" />
                Show all photos
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function PhotoTile({ photo, index, total, eager, onOpen }) {
  if (!photo) return null;
  return (
    <button
      type="button"
      className={styles.tile}
      onClick={() => onOpen(photo)}
      aria-label={`Photo ${index + 1} of ${total}: ${photo.alt}`}
    >
      <ListingImage src={photo.url} alt="" eager={eager} className={styles.image} />
    </button>
  );
}
