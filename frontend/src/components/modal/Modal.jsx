import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import styles from './Modal.module.css';

export default function Modal({
  title,
  onClose,
  children,
  size = 'md',
}) {
  const ref = useRef(null);
  const titleId = useId();
  useScrollLock(true);
  useFocusTrap(ref, true);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        ref={ref}
        className={`${styles.dialog} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <X size={16} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <h2 id={titleId} className={styles.title}>{title}</h2>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
