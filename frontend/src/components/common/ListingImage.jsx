import { useState } from 'react';
import styles from './ListingImage.module.css';

export default function ListingImage({
  src,
  alt,
  className = '',
  eager = false,
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span role="img" aria-label={alt} className={`${styles.fallback} ${className}`} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
