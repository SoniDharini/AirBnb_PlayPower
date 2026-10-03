import { useState } from 'react';
import ListingImage from '../common/ListingImage';
import Modal from '../modal/Modal';
import styles from './HostSection.module.css';

export default function HostSection({ host }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    setOpen(false);
    setSent(false);
    setMessage('');
  };

  return (
    <section className={styles.section} aria-labelledby="host-title">
      <h2 id="host-title">Meet your host</h2>
      <div className={styles.layout}>
        <article className={styles.card}>
          <div className={styles.identity}>
            <span className={styles.logo} aria-hidden="true">{host.initials}</span>
            <div>
              <p className={styles.name}>{host.name}</p>
              <p className={styles.role}>Host</p>
            </div>
          </div>
          <dl className={styles.stats}>
            <div>
              <dt className="sr-only">Reviews</dt>
              <dd>{host.reviewCount.toLocaleString('en-US')}</dd>
              <p>Reviews</p>
            </div>
            <div>
              <dt className="sr-only">Rating</dt>
              <dd>{host.rating.toFixed(2)}</dd>
              <p>Rating</p>
            </div>
            <div>
              <dt className="sr-only">Years hosting</dt>
              <dd>{host.hostingYears}</dd>
              <p>Years hosting</p>
            </div>
          </dl>
        </article>
        <div className={styles.bio}>
          <h3>Co-hosts</h3>
          <ul className={styles.cohosts}>
            {host.cohosts.map((person) => (
              <li key={person.id}>
                <ListingImage src={person.image} alt="" className={styles.cohostPhoto} />
                <span>{person.name}</span>
              </li>
            ))}
          </ul>
          <p>{host.about}</p>
          <ul className={styles.details}>
            {host.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          <p className={styles.response}>Response rate: {host.responseRate}</p>
          <p className={styles.response}>Responds {host.responseTime}</p>
          <button type="button" className={styles.message} onClick={() => setOpen(true)}>Message host</button>
        </div>
      </div>
      {open && (
        <Modal title={`Contact ${host.name}`} onClose={close}>
          {sent ? (
            <p className={styles.sent}>Message saved in this demo. {host.name} is not emailed.</p>
          ) : (
            <form
              className={styles.form}
              onSubmit={(event) => {
                event.preventDefault();
                if (!message.trim()) return;
                setSent(true);
              }}
            >
              <label htmlFor="host-message">Message</label>
              <textarea
                id="host-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                required
                placeholder="Hi Mirashya Homes, I have a question about the apartment."
              />
              <div className={styles.formActions}>
                <button type="button" className={styles.cancel} onClick={close}>Cancel</button>
                <button type="submit" className={styles.send}>Send</button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </section>
  );
}
