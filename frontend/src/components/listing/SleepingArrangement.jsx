import ListingImage from '../common/ListingImage';
import styles from './SleepingArrangement.module.css';

export default function SleepingArrangement({ rooms }) {
  return (
    <section className={styles.section} aria-labelledby="sleep-title">
      <h2 id="sleep-title">Where you'll sleep</h2>
      <div className={styles.row}>
        {rooms.map((room) => (
          <article key={room.id} className={styles.card}>
            <ListingImage src={room.image} alt={room.room} className={styles.photo} />
            <h3>{room.room}</h3>
            <p>{room.beds}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
