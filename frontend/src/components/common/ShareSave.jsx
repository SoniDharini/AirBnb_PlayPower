import { Heart, Share } from 'lucide-react';
import { shareCurrentPage } from '../../utils/share';
import styles from './ShareSave.module.css';

export function ShareButton({ title, onCopied, compact = false }) {
  const onClick = async () => {
    const result = await shareCurrentPage(title);
    if (result === 'copied') onCopied?.('Copied to clipboard');
  };

  return (
    <button type="button" className={compact ? styles.iconOnly : styles.action} onClick={onClick}>
      <Share size={16} strokeWidth={2} aria-hidden="true" />
      {compact ? <span className="sr-only">Share</span> : <span>Share</span>}
    </button>
  );
}

export function SaveButton({ saved, onToggle, compact = false }) {
  return (
    <button
      type="button"
      className={`${compact ? styles.iconOnly : styles.action} ${saved ? styles.saved : ''}`}
      aria-pressed={saved}
      onClick={onToggle}
    >
      <Heart
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        className={saved ? styles.heart : undefined}
        fill={saved ? '#ff385c' : 'none'}
        color={saved ? '#ff385c' : 'currentColor'}
      />
      {compact ? <span className="sr-only">{saved ? 'Saved' : 'Save'}</span> : <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
