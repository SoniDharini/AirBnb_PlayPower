import { KeyRound, Sparkles, Wind } from 'lucide-react';
import styles from './Highlights.module.css';

const ICONS = {
  spark: Sparkles,
  wind: Wind,
  key: KeyRound,
};

export default function Highlights({ items }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const Icon = ICONS[item.icon] || Sparkles;
        return (
          <li key={item.id} className={styles.item}>
            <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.copy}>{item.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
