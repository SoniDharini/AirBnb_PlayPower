import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addMonths,
  formatISODate,
  formatLongDate,
  formatMonth,
  monthMatrix,
  nightsBetween,
  parseISODate,
  todayISO,
} from '../../utils/dates';
import styles from './CalendarSection.module.css';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarSection({
  city,
  checkIn,
  checkOut,
  blockedDates,
  onChange,
}) {
  const initial = parseISODate(checkIn || todayISO());
  const [visible, setVisible] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [hover, setHover] = useState(null);
  const today = todayISO();
  const blocked = useMemo(() => new Set(blockedDates), [blockedDates]);
  const nextMonth = addMonths(visible, 1);
  const nights = nightsBetween(checkIn, checkOut);
  const previewEnd = checkIn && !checkOut && hover && hover > checkIn ? hover : null;

  const selectDay = (iso) => {
    if (!checkIn || checkOut) {
      onChange(iso, null);
      return;
    }
    if (iso <= checkIn) {
      onChange(iso, null);
      return;
    }
    const blockedInside = rangeIncludesBlocked(checkIn, iso, blocked);
    if (blockedInside) {
      onChange(iso, null);
      return;
    }
    onChange(checkIn, iso);
  };

  return (
    <section id="availability" className={styles.section} aria-labelledby="calendar-title">
      <div className={styles.intro}>
        <h2 id="calendar-title">
          {checkIn && checkOut ? `${nights} night${nights === 1 ? '' : 's'} in ${city}` : checkIn ? 'Select checkout date' : 'Select check-in date'}
        </h2>
        <p>
          {checkIn && checkOut
            ? `${formatLongDate(checkIn)} – ${formatLongDate(checkOut)}`
            : 'Add your travel dates for exact pricing'}
        </p>
      </div>
      <div className={styles.months}>
        <button
          type="button"
          className={`${styles.nav} ${styles.navLeft}`}
          aria-label="Previous month"
          onClick={() => setVisible((month) => addMonths(month, -1))}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${styles.nav} ${styles.navRight}`}
          aria-label="Next month"
          onClick={() => setVisible((month) => addMonths(month, 1))}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
        <Month
          monthDate={visible}
          checkIn={checkIn}
          checkOut={checkOut}
          previewEnd={previewEnd}
          today={today}
          blocked={blocked}
          onSelect={selectDay}
          onHover={setHover}
        />
        <Month
          monthDate={nextMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          previewEnd={previewEnd}
          today={today}
          blocked={blocked}
          onSelect={selectDay}
          onHover={setHover}
        />
      </div>
      {(checkIn || checkOut) && (
        <button type="button" className={styles.clear} onClick={() => onChange(null, null)}>
          Clear dates
        </button>
      )}
    </section>
  );
}

function rangeIncludesBlocked(start, end, blocked) {
  const cursor = parseISODate(start);
  const last = parseISODate(end);
  while (cursor < last) {
    if (blocked.has(formatISODate(cursor))) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

function inRange(iso, start, end) {
  if (!start || !end) return false;
  return iso > start && iso < end;
}

function Month({ monthDate, checkIn, checkOut, previewEnd, today, blocked, onSelect, onHover }) {
  const weeks = monthMatrix(monthDate.getFullYear(), monthDate.getMonth());
  const rangeEnd = checkOut || previewEnd;
  return (
    <div className={styles.month}>
      <h3>{formatMonth(monthDate)}</h3>
      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className={styles.weeks}>
        {weeks.map((week) => (
          <div key={week.map((day) => day?.toISOString() || 'x').join('-')} className={styles.week}>
            {week.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} className={styles.empty} />;
              const iso = formatISODate(day);
              const disabled = iso < today || blocked.has(iso);
              const selected = iso === checkIn || iso === checkOut;
              const between = inRange(iso, checkIn, rangeEnd);
              const label = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  aria-label={label}
                  aria-pressed={selected}
                  className={`${styles.day} ${between ? styles.between : ''} ${iso === checkIn && rangeEnd ? styles.rangeStart : ''} ${iso === rangeEnd && checkIn && iso !== checkIn ? styles.rangeEnd : ''}`}
                  onClick={() => onSelect(iso)}
                  onMouseEnter={() => onHover(iso)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(iso)}
                >
                  <span className={`${styles.num} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}>{day.getDate()}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
