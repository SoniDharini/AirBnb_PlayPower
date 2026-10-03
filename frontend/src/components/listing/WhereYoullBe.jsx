import styles from './WhereYoullBe.module.css';

export default function WhereYoullBe({ location, city, region, coordinates }) {
  const { lat, lng } = coordinates;
  const bbox = `${lng - 0.03}%2C${lat - 0.02}%2C${lng + 0.03}%2C${lat + 0.02}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <section id="location" className={styles.section} aria-labelledby="location-title">
      <h2 id="location-title">Where you'll be</h2>
      <p className={styles.place}>{location}</p>
      <p className={styles.copy}>
        {city} is a beach neighborhood in {region}. The apartment is a short ride from Candolim Beach, with cafés and Fort Aguada nearby.
      </p>
      <div className={styles.mapWrap}>
        <iframe title={`Map of ${location}`} src={src} loading="lazy" />
      </div>
    </section>
  );
}
