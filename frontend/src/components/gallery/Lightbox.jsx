import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react';
import ListingImage from '../common/ListingImage';
import { SaveButton, ShareButton } from '../common/ShareSave';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import styles from './Lightbox.module.css';

export default function Lightbox({
  photos,
  initialIndex = 0,
  onClose,
  saved = false,
  onToggleSaved,
  onCopied,
  onIndexChange,
}) {
  const [index, setIndex] = useState(initialIndex);
  const [visible, setVisible] = useState(true);
  const dialogRef = useRef(null);
  const photo = photos[index];
  useScrollLock(true);
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    const neighbors = [photos[index - 1], photos[index + 1], photos[0], photos[photos.length - 1]];
    neighbors.forEach((item) => {
      if (!item?.url) return;
      const image = new Image();
      image.src = item.url;
    });
  }, [index, photos]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        show((index + 1) % photos.length);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show((index - 1 + photos.length) % photos.length);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, photos.length, onClose]);

  const show = (next) => {
    setVisible(false);
    window.setTimeout(() => {
      setIndex(next);
      setVisible(true);
      onIndexChange?.(next);
    }, 120);
  };

  if (!photo) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${photo.sectionTitle}, photo ${index + 1} of ${photos.length}`}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <button type="button" className={styles.icon} aria-label="Back to photo tour" onClick={onClose}>
            <LayoutGrid size={16} aria-hidden="true" />
          </button>
          <div className={styles.center}>
            <p className={styles.room}>{photo.sectionTitle}</p>
            <p className={styles.count}>{index + 1} of {photos.length}</p>
          </div>
          <div className={styles.tools}>
            <ShareButton title={photo.alt} onCopied={onCopied} compact />
            <SaveButton saved={saved} onToggle={onToggleSaved} compact />
            <button type="button" className={styles.icon} aria-label="Close photo viewer" onClick={onClose}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </header>
        <div className={styles.stage}>
          {photos.length > 1 && (
            <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous photo" onClick={() => show((index - 1 + photos.length) % photos.length)}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          )}
          <ListingImage
            key={photo.id}
            src={photo.url}
            alt={photo.alt}
            eager
            className={`${styles.photo} ${visible ? styles.show : ''}`}
          />
          {photos.length > 1 && (
            <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next photo" onClick={() => show((index + 1) % photos.length)}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
