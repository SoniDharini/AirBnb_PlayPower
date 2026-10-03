import { Minus, Plus } from 'lucide-react';
import { guestCount } from '../../utils/dates';
import styles from './GuestFields.module.css';

const ROWS = [
  { key: 'adults', title: 'Adults', subtitle: 'Age 13+', min: 1 },
  { key: 'children', title: 'Children', subtitle: 'Ages 2–12', min: 0 },
  { key: 'infants', title: 'Infants', subtitle: 'Under 2', min: 0, max: 5, free: true },
  { key: 'pets', title: 'Pets', subtitle: 'Bringing an animal?', min: 0, max: 2, free: true },
];

export default function GuestFields({ guests, maxGuests = 3, onChange }) {
  const staying = guestCount(guests);

  const update = (key, delta, row) => {
    const nextValue = guests[key] + delta;
    if (nextValue < row.min) return;
    if (row.max != null && nextValue > row.max) return;
    if (!row.free && staying + delta > maxGuests) return;
    onChange({ ...guests, [key]: nextValue });
  };

  return (
    <div className={styles.list}>
      {ROWS.map((row) => {
        const value = guests[row.key];
        const atCap = !row.free && staying >= maxGuests;
        const decreaseDisabled = value <= row.min;
        const increaseDisabled = (row.max != null && value >= row.max) || atCap;
        return (
          <div key={row.key} className={styles.row}>
            <div>
              <p className={styles.title}>{row.title}</p>
              <p className={styles.subtitle}>{row.subtitle}</p>
            </div>
            <div className={styles.stepper}>
              <button
                type="button"
                aria-label={`Decrease ${row.title.toLowerCase()}`}
                disabled={decreaseDisabled}
                onClick={() => update(row.key, -1, row)}
              >
                <Minus size={14} aria-hidden="true" />
              </button>
              <span aria-live="polite">{value}</span>
              <button
                type="button"
                aria-label={`Increase ${row.title.toLowerCase()}`}
                disabled={increaseDisabled}
                onClick={() => update(row.key, 1, row)}
              >
                <Plus size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
      <p className={styles.note}>This place has a maximum of {maxGuests} guests, not including infants.</p>
    </div>
  );
}
