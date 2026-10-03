import { useMemo, useState } from 'react';
import { AmenityIcon } from '../common/icons';
import Modal from '../modal/Modal';
import styles from './AmenitiesSection.module.css';

export default function AmenitiesSection({ amenities, previewIds }) {
  const [open, setOpen] = useState(false);
  const preview = previewIds
    .map((id) => amenities.find((item) => item.id === id))
    .filter(Boolean);

  const groups = useMemo(() => {
    const map = new Map();
    amenities.forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    });
    return [...map.entries()];
  }, [amenities]);

  return (
    <section id="amenities" className={styles.section} aria-labelledby="amenities-title">
      <h2 id="amenities-title">What this place offers</h2>
      <ul className={styles.grid}>
        {preview.map((item) => (
          <li key={item.id}>
            <AmenityIcon name={item.icon} />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.showAll} onClick={() => setOpen(true)}>
        Show all {amenities.length} amenities
      </button>
      {open && (
        <Modal title={`What this place offers`} onClose={() => setOpen(false)} size="md">
          <div className={styles.groups}>
            {groups.map(([category, items]) => (
              <section key={category} className={styles.group}>
                <h3>{category}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <AmenityIcon name={item.icon} />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Modal>
      )}
    </section>
  );
}
