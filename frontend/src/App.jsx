import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToastViewport from './components/common/ToastViewport';
import ListingPage from './pages/ListingPage/ListingPage';
import { AppStateProvider } from './context/AppState';
import { LISTING_ID } from './constants/listing';

const PhotoTourPage = lazy(() => import('./pages/PhotoTourPage/PhotoTourPage'));

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}

function Shell() {
  const location = useLocation();
  const photoTour = location.pathname.endsWith('/photos');
  return (
    <>
      <a className="skip-link" href="#site-content">Skip to content</a>
      {!photoTour && <Header />}
      <Suspense fallback={<p className="route-fallback">Loading photos…</p>}>
        <Routes>
          <Route path="/" element={<Navigate to={`/rooms/${LISTING_ID}`} replace />} />
          <Route path="/rooms/:id" element={<ListingPage />} />
          <Route path="/rooms/:id/photos" element={<PhotoTourPage />} />
          <Route path="*" element={<Navigate to={`/rooms/${LISTING_ID}`} replace />} />
        </Routes>
      </Suspense>
      {!photoTour && <Footer />}
      <ToastViewport />
    </>
  );
}
