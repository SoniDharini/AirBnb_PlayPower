import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PhotoGrid from '../../components/gallery/PhotoGrid';
import { SaveButton, ShareButton } from '../../components/common/ShareSave';
import { useAppState } from '../../context/AppState';
import { listingPath } from '../../constants/listing';
import { flattenPhotos } from '../../utils/photos';
import styles from './PhotoTourPage.module.css';

const Lightbox = lazy(() => import('../../components/gallery/Lightbox'));

const PAGE_LINKS = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
];

export default function PhotoTourPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { listing, loading, error, reload, saved, toggleSaved, pushToast } = useAppState();
  const [activeRoom, setActiveRoom] = useState(listing?.photoSections?.[0]?.id || 'additional');
  const openedLightbox = useRef(false);
  const photos = useMemo(() => flattenPhotos(listing?.photoSections || []), [listing]);
  const photoId = params.get('photo');
  const photoIndex = Math.max(0, photos.findIndex((photo) => photo.id === photoId));

  useEffect(() => {
    if (!listing || openedLightbox.current) return undefined;
    const sectionId = location.state?.sectionId;
    if (sectionId) {
      document.getElementById(`room-${sectionId}`)?.scrollIntoView();
    } else if (!params.get('photo')) {
      window.scrollTo(0, 0);
    }
    return undefined;
  }, [listing]);

  useEffect(() => {
    const nodes = (listing?.photoSections || [])
      .map((section) => document.getElementById(`room-${section.id}`))
      .filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).at(-1);
      if (visible?.target?.id) setActiveRoom(visible.target.id.replace('room-', ''));
    }, { rootMargin: '-20% 0px -60% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [listing]);

  const openPhoto = (photo) => {
    openedLightbox.current = true;
    setParams({ photo: photo.id });
  };

  const closePhoto = () => {
    if (openedLightbox.current) {
      openedLightbox.current = false;
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(params);
    next.delete('photo');
    setParams(next, { replace: true });
  };

  const goToListing = (hash) => {
    navigate(`${listingPath(listing.id)}${hash}`);
  };

  if (loading) return <p className="route-fallback">Loading photos…</p>;
  if (error || !listing) {
    return (
      <main className="status-page">
        <div>
          <h1>Photos didn’t load</h1>
          <p>{error}</p>
          <button type="button" onClick={reload}>Try again</button>
        </div>
      </main>
    );
  }

  return (
    <main id="site-content" className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} aria-label="Back to listing" onClick={() => navigate(listingPath(listing.id))}>
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <h1>Photo tour</h1>
        <div className={styles.actions}>
          <ShareButton title={listing.title} onCopied={pushToast} />
          <SaveButton saved={saved} onToggle={toggleSaved} />
        </div>
      </header>
      <div className={styles.subnavWrap}>
        <div className={`shell ${styles.subnav}`}>
          {PAGE_LINKS.map((link) => (
            link.id === 'photos' ? (
              <a key={link.id} href="#photos">{link.label}</a>
            ) : (
              <button key={link.id} type="button" onClick={() => goToListing(`#${link.id}`)}>{link.label}</button>
            )
          ))}
        </div>
      </div>
      <nav className={styles.rooms} aria-label="Rooms">
        <div className={`shell ${styles.roomRow}`}>
          {listing.photoSections.map((section) => (
            <a
              key={section.id}
              href={`#room-${section.id}`}
              className={activeRoom === section.id ? styles.roomActive : undefined}
              aria-current={activeRoom === section.id ? 'true' : undefined}
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>
      <div id="photos" className={`shell ${styles.content}`}>
        {listing.photoSections.map((section) => (
          <section key={section.id} id={`room-${section.id}`} className={styles.room}>
            <div className={styles.meta}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            <PhotoGrid photos={section.photos} layout={section.layout} onOpen={openPhoto} />
          </section>
        ))}
      </div>
      {photoId && photos.length > 0 && (
        <Suspense fallback={null}>
          <Lightbox
            photos={photos}
            initialIndex={photoIndex}
            onClose={closePhoto}
            saved={saved}
            onToggleSaved={toggleSaved}
            onCopied={pushToast}
            onIndexChange={(next) => {
              const nextPhoto = photos[next];
              if (nextPhoto) setParams({ photo: nextPhoto.id }, { replace: true });
            }}
          />
        </Suspense>
      )}
    </main>
  );
}
