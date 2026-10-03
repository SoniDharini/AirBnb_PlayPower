import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AmenitiesSection from '../../components/listing/AmenitiesSection';
import BookingCard from '../../components/booking/BookingCard';
import CalendarSection from '../../components/listing/CalendarSection';
import Description from '../../components/listing/Description';
import HeroGallery from '../../components/gallery/HeroGallery';
import Highlights from '../../components/listing/Highlights';
import NearbyStays from '../../components/listing/NearbyStays';
import HostSection from '../../components/host/HostSection';
import ListingHeading from '../../components/listing/ListingHeading';
import PropertySummary from '../../components/listing/PropertySummary';
import ReviewsSection from '../../components/reviews/ReviewsSection';
import SectionNav from '../../components/listing/SectionNav';
import SleepingArrangement from '../../components/listing/SleepingArrangement';
import ThingsToKnow from '../../components/listing/ThingsToKnow';
import WhereYoullBe from '../../components/listing/WhereYoullBe';
import { useAppState } from '../../context/AppState';
import { photosPath } from '../../constants/listing';
import { flattenPhotos } from '../../utils/photos';
import styles from './ListingPage.module.css';

export default function ListingPage() {
  const navigate = useNavigate();
  const state = useAppState();
  const [navVisible, setNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('photos');

  const heroPhotos = useMemo(() => {
    if (!state.listing) return [];
    const all = flattenPhotos(state.listing.photoSections);
    const chosen = (state.listing.heroPhotoIds || [])
      .map((id) => all.find((photo) => photo.id === id))
      .filter(Boolean);
    return chosen.length ? chosen : all.slice(0, 5);
  }, [state.listing]);

  useLayoutEffect(() => {
    if (!state.listing) return undefined;
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target) {
      sessionStorage.removeItem('listing-scroll');
      target.scrollIntoView();
      return undefined;
    }
    const saved = sessionStorage.getItem('listing-scroll');
    if (saved != null) {
      window.scrollTo(0, Number(saved));
      sessionStorage.removeItem('listing-scroll');
    }
    return undefined;
  }, [state.listing]);

  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY > 540);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const nodes = ['photos', 'amenities', 'reviews', 'location']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [state.listing]);

  const openTour = (photo) => {
    sessionStorage.setItem('listing-scroll', String(window.scrollY));
    navigate(photosPath(state.listing.id), { state: photo ? { sectionId: photo.sectionId } : null });
  };

  if (state.loading) {
    return (
      <main className="shell" id="site-content">
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonHero} />
      </main>
    );
  }

  if (state.error || !state.listing) {
    return (
      <main className="status-page" id="site-content">
        <div>
          <h1>This listing didn’t load</h1>
          <p>{state.error || 'Something went wrong.'}</p>
          <button type="button" className={styles.retry} onClick={state.reload}>Try again</button>
        </div>
      </main>
    );
  }

  const { listing } = state;

  return (
    <main id="site-content">
      <SectionNav
        visible={navVisible}
        active={activeSection}
        onSelect={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
      />
      <div className="shell">
        <ListingHeading
          title={listing.title}
          saved={state.saved}
          onToggleSaved={state.toggleSaved}
          onCopied={state.pushToast}
        />
        <div id="photos">
          <HeroGallery
            photos={heroPhotos}
            onOpenPhoto={openTour}
            onShowAll={() => openTour(null)}
          />
        </div>
        <div className={styles.layout}>
          <div>
            <PropertySummary listing={listing} />
            <Highlights items={listing.highlights} />
            <Description text={listing.description} />
            <SleepingArrangement rooms={listing.sleeping} />
            <AmenitiesSection amenities={listing.amenities} previewIds={listing.amenitiesPreview} />
            <CalendarSection
              city={listing.city}
              checkIn={state.checkIn}
              checkOut={state.checkOut}
              blockedDates={state.blockedDates}
              onChange={state.setDates}
            />
          </div>
          <BookingCard
            listing={listing}
            checkIn={state.checkIn}
            checkOut={state.checkOut}
            guests={state.guests}
            onGuests={state.setGuests}
            quote={state.quote}
            quoteError={state.quoteError}
            quoteLoading={state.quoteLoading}
            claimed={state.claimed}
            onClaim={state.claimOffer}
            onReserve={state.reserve}
          />
        </div>
        <ReviewsSection
          rating={listing.rating}
          reviewCount={listing.reviewCount}
          categories={listing.ratingCategories}
          distribution={listing.ratingDistribution}
          highlights={listing.reviewHighlights}
          reviews={listing.reviews}
        />
        <WhereYoullBe
          location={listing.location}
          city={listing.city}
          region={listing.region}
          coordinates={listing.coordinates}
        />
        <HostSection host={listing.host} />
        <ThingsToKnow
          cancellation={listing.cancellation}
          rules={listing.houseRules}
          safety={listing.safety}
        />
        <NearbyStays />
      </div>
    </main>
  );
}
