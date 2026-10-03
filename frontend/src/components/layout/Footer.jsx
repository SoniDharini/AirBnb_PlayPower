import { useAppState } from '../../context/AppState';
import styles from './Footer.module.css';

const COLUMNS = [
  { title: 'Support', links: ['Help Center', 'Safety information', 'Cancellation options', 'Report a neighborhood concern'] },
  { title: 'Hosting', links: ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum'] },
  { title: 'Airbnb', links: ['Newsroom', 'Careers', 'Investors', 'Gift cards'] },
];

export default function Footer() {
  const { pushToast } = useAppState();
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.grid}`}>
        {COLUMNS.map((column) => (
          <section key={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link}><button type="button" onClick={() => pushToast(`${link} is not part of this demo`)}>{link}</button></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className={`shell ${styles.bottomInner}`}>
          <p>© {new Date().getFullYear()} Airbnb clone · Candolim listing demo</p>
          <p>English (IN) · INR</p>
        </div>
      </div>
    </footer>
  );
}
