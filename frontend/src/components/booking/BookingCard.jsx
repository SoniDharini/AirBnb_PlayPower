import { useRef, useState } from 'react';
import { ChevronDown, Flag } from 'lucide-react';
import GuestFields from './GuestFields';
import Modal from '../modal/Modal';
import { useAppState } from '../../context/AppState';
import { useDismiss } from '../../hooks/useDismiss';
import { dayBeforeLabel, formatCardDate, guestLabel, nightsBetween } from '../../utils/dates';
import { discountFor, formatINR } from '../../utils/format';
import styles from './BookingCard.module.css';

export default function BookingCard({
  listing,
  checkIn,
  checkOut,
  guests,
  onGuests,
  quote,
  quoteError,
  quoteLoading,
  claimed,
  onClaim,
  onReserve,
}) {
  const { pushToast } = useAppState();
  const [termsOpen, setTermsOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [reserveError, setReserveError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const guestRef = useRef(null);
  useDismiss(guestsOpen, () => setGuestsOpen(false), guestRef);

  const nights = quote?.nights || nightsBetween(checkIn, checkOut);
  const subtotal = quote?.subtotal || 0;
  const discount = discountFor(subtotal, claimed);
  const total = subtotal - discount;

  const openConfirm = () => {
    if (!checkIn || !checkOut) {
      document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (quoteError || !quote) return;
    setReserveError('');
    setConfirmed(null);
    setConfirmOpen(true);
  };

  const confirm = async () => {
    setSubmitting(true);
    setReserveError('');
    try {
      const booking = await onReserve();
      setConfirmed(booking);
    } catch (error) {
      setReserveError(error?.response?.data?.error || 'The reservation could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.sticky}>
      <aside className={`${styles.offer} ${claimed ? styles.offerClaimed : ''}`}>
        <div className={styles.offerMain}>
          <img className={styles.offerIcon} src="/images/discount-tag.png" alt="" />
          <div>
            <p>{claimed ? '10% off applied to this stay' : 'Get 10% off your next stay.'}</p>
            <button type="button" className={styles.terms} aria-expanded={termsOpen} onClick={() => setTermsOpen((open) => !open)}>
              Terms apply
            </button>
          </div>
        </div>
        {termsOpen && <p className={styles.termsCopy}>Claiming takes 10% off the stay total shown here. This demo does not collect payment.</p>}
        <button type="button" className={styles.claim} onClick={onClaim} disabled={claimed}>
          {claimed ? 'Claimed' : 'Claim'}
        </button>
      </aside>
      <section className={styles.card} aria-label="Reservation">
        <div className={styles.priceRow}>
          {quote ? (
            <p>
              <span className={styles.price}>{formatINR(total)}</span>
              <span> for {nights} night{nights === 1 ? '' : 's'}</span>
            </p>
          ) : (
            <p className={styles.price}>Add dates for prices</p>
          )}
        </div>
        <div className={styles.picker}>
          <button type="button" className={styles.date} onClick={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Check-in</span>
            <strong>{formatCardDate(checkIn)}</strong>
          </button>
          <button type="button" className={`${styles.date} ${styles.checkout}`} onClick={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Checkout</span>
            <strong>{formatCardDate(checkOut)}</strong>
          </button>
          <div className={styles.guestAnchor} ref={guestRef}>
            <button
              type="button"
              className={styles.guests}
              aria-expanded={guestsOpen}
              onClick={() => setGuestsOpen((open) => !open)}
            >
              <span>
                <span className={styles.kicker}>Guests</span>
                <strong>{guestLabel(guests)}</strong>
              </span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            {guestsOpen && (
              <div className={styles.guestPopover} role="dialog" aria-label="Guests">
                <GuestFields guests={guests} maxGuests={listing.maxGuests} onChange={onGuests} />
              </div>
            )}
          </div>
        </div>
        {checkIn && (
          <p className={styles.cancelNote}>Free cancellation before {dayBeforeLabel(checkIn)}</p>
        )}
        <button type="button" className={styles.reserve} onClick={openConfirm} disabled={quoteLoading || Boolean(quoteError)}>
          {quoteLoading ? 'Checking…' : 'Reserve'}
        </button>
        <p className={styles.note}>You won't be charged yet</p>
        {quoteError && <p className={styles.error} role="alert">{quoteError}</p>}
      </section>
      <button
        type="button"
        className={styles.report}
        onClick={() => pushToast('Listing reports are not part of this demo')}
      >
        <Flag size={16} aria-hidden="true" />
        <span>Report this listing</span>
      </button>
      {confirmOpen && (
        <Modal
          title={confirmed ? 'Reservation confirmed' : 'Confirm your reservation'}
          onClose={() => setConfirmOpen(false)}
        >
          {confirmed ? (
            <div className={styles.success}>
              <p>Your stay at {listing.title} is reserved.</p>
              <dl>
                <div><dt>Confirmation</dt><dd>{confirmed.id}</dd></div>
                <div><dt>Check-in</dt><dd>{formatCardDate(confirmed.checkIn)}</dd></div>
                <div><dt>Check-out</dt><dd>{formatCardDate(confirmed.checkOut)}</dd></div>
                <div><dt>Guests</dt><dd>{confirmed.guests}</dd></div>
                <div><dt>Total</dt><dd>{formatINR(confirmed.total)}</dd></div>
              </dl>
              <button type="button" className={styles.reserve} onClick={() => setConfirmOpen(false)}>Done</button>
            </div>
          ) : (
            <div className={styles.confirm}>
              <dl>
                <div><dt>Check-in</dt><dd>{formatCardDate(checkIn)}</dd></div>
                <div><dt>Check-out</dt><dd>{formatCardDate(checkOut)}</dd></div>
                <div><dt>Guests</dt><dd>{guestLabel(guests)}</dd></div>
                <div><dt>Total</dt><dd>{formatINR(total)}</dd></div>
              </dl>
              {reserveError && <p className={styles.error} role="alert">{reserveError}</p>}
              <div className={styles.bookingActions}>
                <button type="button" className={styles.cancel} onClick={() => setConfirmOpen(false)}>Cancel</button>
                <button type="button" className={styles.reserve} disabled={submitting} onClick={confirm}>
                  {submitting ? 'Confirming…' : 'Confirm'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
