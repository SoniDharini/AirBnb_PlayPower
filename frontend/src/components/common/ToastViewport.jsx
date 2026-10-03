import { useAppState } from '../../context/AppState';
import styles from './ToastViewport.module.css';

export default function ToastViewport() {
  const { toasts } = useAppState();
  return (
    <div className={styles.region} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <p key={toast.id} className={styles.toast} role="status">{toast.message}</p>
      ))}
    </div>
  );
}
