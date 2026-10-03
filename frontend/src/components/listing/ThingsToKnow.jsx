import { useState } from 'react';
import { CalendarX, ShieldCheck, ListChecks } from 'lucide-react';
import Modal from '../modal/Modal';
import styles from './ThingsToKnow.module.css';

export default function ThingsToKnow({ cancellation, rules, safety }) {
  const [active, setActive] = useState(null);
  const columns = [
    {
      id: 'cancellation',
      title: 'Cancellation policy',
      icon: CalendarX,
      lines: [cancellation.summary],
      details: cancellation.details,
    },
    {
      id: 'rules',
      title: 'House rules',
      icon: ListChecks,
      lines: rules.summary,
      details: rules.details,
    },
    {
      id: 'safety',
      title: 'Safety & property',
      icon: ShieldCheck,
      lines: safety.summary,
      details: safety.details,
    },
  ];
  const current = columns.find((column) => column.id === active);

  return (
    <section className={styles.section} aria-labelledby="know-title">
      <h2 id="know-title">Things to know</h2>
      <div className={styles.columns}>
        {columns.map((column) => {
          const Icon = column.icon;
          return (
            <article key={column.id}>
              <h3>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                {column.title}
              </h3>
              <ul>
                {column.lines.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <button type="button" className={styles.more} onClick={() => setActive(column.id)}>Show more</button>
            </article>
          );
        })}
      </div>
      {current && (
        <Modal title={current.title} onClose={() => setActive(null)}>
          <ul className={styles.details}>
            {current.details.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </Modal>
      )}
    </section>
  );
}
