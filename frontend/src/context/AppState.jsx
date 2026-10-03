import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createBooking, fetchAvailability, fetchListing, fetchQuote } from '../api/listingApi';
import { LISTING_ID } from '../constants/listing';
import { defaultStay, guestCount } from '../utils/dates';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const initialStay = defaultStay();
  const [listing, setListing] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState(initialStay.checkIn);
  const [checkOut, setCheckOut] = useState(initialStay.checkOut);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [toasts, setToasts] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextListing, availability] = await Promise.all([
        fetchListing(LISTING_ID),
        fetchAvailability(LISTING_ID),
      ]);
      setListing(nextListing);
      setBlockedDates(availability.blockedDates || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'We could not load this listing. Start the API and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setSaved(window.localStorage.getItem(`stay-saved:${LISTING_ID}`) === 'true');
    setClaimed(window.localStorage.getItem(`stay-claimed:${LISTING_ID}`) === 'true');
  }, []);

  const pushToast = useCallback((message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const toggleSaved = useCallback(() => {
    setSaved((current) => {
      const next = !current;
      window.localStorage.setItem(`stay-saved:${LISTING_ID}`, String(next));
      return next;
    });
  }, []);

  const claimOffer = useCallback(() => {
    setClaimed(true);
    window.localStorage.setItem(`stay-claimed:${LISTING_ID}`, 'true');
    pushToast('10% discount claimed');
  }, [pushToast]);

  const people = guestCount(guests);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setQuote(null);
      setQuoteError('');
      setQuoteLoading(false);
      return undefined;
    }
    let cancelled = false;
    setQuoteLoading(true);
    setQuoteError('');
    fetchQuote({
      listingId: LISTING_ID,
      checkIn,
      checkOut,
      guests: people,
    })
      .then((nextQuote) => {
        if (!cancelled) setQuote(nextQuote);
      })
      .catch((err) => {
        if (!cancelled) {
          setQuote(null);
          setQuoteError(err?.response?.data?.error || 'Those dates could not be priced.');
        }
      })
      .finally(() => {
        if (!cancelled) setQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, people]);

  const setDates = useCallback((nextCheckIn, nextCheckOut) => {
    setCheckIn(nextCheckIn);
    setCheckOut(nextCheckOut);
  }, []);

  const reserve = useCallback(async () => createBooking({
    listingId: LISTING_ID,
    checkIn,
    checkOut,
    guests: people,
    discountClaimed: claimed,
  }), [checkIn, checkOut, people, claimed]);

  const value = useMemo(() => ({
    listing,
    loading,
    error,
    reload: load,
    blockedDates,
    checkIn,
    checkOut,
    setDates,
    guests,
    setGuests,
    guestTotal: people,
    quote,
    quoteError,
    quoteLoading,
    saved,
    toggleSaved,
    claimed,
    claimOffer,
    toasts,
    pushToast,
    reserve,
  }), [
    listing, loading, error, load, blockedDates, checkIn, checkOut, setDates,
    guests, people, quote, quoteError, quoteLoading, saved, toggleSaved,
    claimed, claimOffer, toasts, pushToast, reserve,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
