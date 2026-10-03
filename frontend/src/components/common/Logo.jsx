import { Link } from 'react-router-dom';
import { listingPath } from '../../constants/listing';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <Link to={listingPath()} className={styles.logo} aria-label="Airbnb home">
      <img className={styles.mark} src="/images/airbnb-logo.png" alt="" />
    </Link>
  );
}
