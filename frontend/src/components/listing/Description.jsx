import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Description.module.css';

const COLLAPSED = 144;

export default function Description({ text }) {
  const bodyRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(COLLAPSED);
  const [canExpand, setCanExpand] = useState(false);

  useLayoutEffect(() => {
    const node = bodyRef.current;
    if (!node) return;
    setFullHeight(node.scrollHeight);
    setCanExpand(node.scrollHeight > COLLAPSED + 8);
  }, [text]);

  const paragraphs = text.split('\n\n');

  return (
    <section className={styles.section} aria-labelledby="about-title">
      <h2 id="about-title" className="sr-only">About this place</h2>
      <div className={styles.clip} style={{ maxHeight: expanded || !canExpand ? fullHeight : COLLAPSED }}>
        <div ref={bodyRef}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </div>
      {!expanded && canExpand && <div className={styles.fade} aria-hidden="true" />}
      {canExpand && (
        <button
          type="button"
          className={styles.more}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <span>{expanded ? 'Show less' : 'Show more'}</span>
          <ChevronDown size={16} aria-hidden="true" className={expanded ? styles.up : undefined} />
        </button>
      )}
    </section>
  );
}
