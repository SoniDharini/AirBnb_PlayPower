import { SaveButton, ShareButton } from '../common/ShareSave';
import styles from './ListingHeading.module.css';

export default function ListingHeading({ title, saved, onToggleSaved, onCopied }) {
  return (
    <div className={styles.row}>
      <h1>{title}</h1>
      <div className={styles.actions}>
        <ShareButton title={title} onCopied={onCopied} />
        <SaveButton saved={saved} onToggle={onToggleSaved} />
      </div>
    </div>
  );
}
