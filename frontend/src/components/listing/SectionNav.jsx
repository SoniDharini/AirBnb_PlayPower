import styles from './SectionNav.module.css';

const LINKS = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
];

export default function SectionNav({ visible, active, onSelect }) {
  return (
    <nav className={`${styles.nav} ${visible ? styles.visible : ''}`} aria-label="Listing sections">
      <div className={`shell ${styles.inner}`}>
        {LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            className={active === link.id ? styles.active : undefined}
            aria-current={active === link.id ? 'true' : undefined}
            onClick={() => onSelect(link.id)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
