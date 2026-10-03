import { useRef, useState, useEffect } from 'react';
import { Globe, Menu, Search, UserRound } from 'lucide-react';
import Logo from '../common/Logo';
import GuestFields from '../booking/GuestFields';
import { useAppState } from '../../context/AppState';
import { useDismiss } from '../../hooks/useDismiss';
import { formatLongDate } from '../../utils/dates';
import styles from './Header.module.css';

export default function Header() {
  const {
    listing, checkIn, checkOut, guests, setGuests, pushToast,
  } = useAppState();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(null);
  const [destination, setDestination] = useState('Candolim');
  const [menu, setMenu] = useState(null);
  const [language, setLanguage] = useState('English');
  const searchRef = useRef(null);
  const hostRef = useRef(null);
  const globeRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useDismiss(Boolean(panel), () => setPanel(null), searchRef);
  useDismiss(menu === 'host', () => setMenu(null), hostRef);
  useDismiss(menu === 'globe', () => setMenu(null), globeRef);
  useDismiss(menu === 'profile', () => setMenu(null), profileRef);

  const whenLabel = checkIn && checkOut
    ? `${formatLongDate(checkIn)} – ${formatLongDate(checkOut)}`
    : 'Any week';

  const openPanel = (name) => {
    setMenu(null);
    setPanel((current) => (current === name ? null : name));
  };

  const openMenu = (name) => {
    setPanel(null);
    setMenu((current) => (current === name ? null : name));
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`shell ${styles.inner}`}>
        <Logo />
        <div className={styles.searchWrap} ref={searchRef}>
          <div className={`${styles.search} ${panel ? styles.searchOpen : ''}`} role="search">
            <button
              type="button"
              className={`${styles.segment} ${styles.anywhere} ${panel === 'where' ? styles.segmentActive : ''}`}
              aria-expanded={panel === 'where'}
              aria-label="Anywhere"
              onClick={() => openPanel('where')}
            >
              <HomeMark />
              <span>Anywhere</span>
            </button>
            <span className={styles.divider} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.segment} ${styles.quiet} ${panel === 'when' ? styles.segmentActive : ''}`}
              aria-expanded={panel === 'when'}
              onClick={() => openPanel('when')}
            >
              Anytime
            </button>
            <span className={styles.divider} aria-hidden="true" />
            <button
              type="button"
              className={`${styles.segment} ${styles.quiet} ${styles.guests} ${panel === 'who' ? styles.segmentActive : ''}`}
              aria-expanded={panel === 'who'}
              onClick={() => openPanel('who')}
            >
              Add guests
            </button>
            <button
              type="button"
              className={styles.searchButton}
              aria-label="Search"
              onClick={() => {
                setPanel(null);
                pushToast(listing ? `Showing ${listing.title}` : 'Showing Candolim');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Search size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
          {panel === 'where' && (
            <div className={styles.popover} role="dialog" aria-label="Destination">
              <label className={styles.fieldLabel} htmlFor="destination">Search destinations</label>
              <input
                id="destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Candolim"
              />
            </div>
          )}
          {panel === 'when' && (
            <div className={styles.popover} role="dialog" aria-label="Dates">
              <p className={styles.popoverTitle}>Dates</p>
              <p className={styles.popoverCopy}>{whenLabel}</p>
              <button
                type="button"
                className={styles.popoverAction}
                onClick={() => {
                  setPanel(null);
                  document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Choose dates on the calendar
              </button>
            </div>
          )}
          {panel === 'who' && (
            <div className={`${styles.popover} ${styles.whoPopover}`} role="dialog" aria-label="Guests">
              <GuestFields
                guests={guests}
                maxGuests={listing?.maxGuests || 3}
                onChange={setGuests}
              />
            </div>
          )}
        </div>
        <div className={styles.tools}>
          <div className={styles.menuAnchor} ref={hostRef}>
            <button type="button" className={styles.host} aria-expanded={menu === 'host'} onClick={() => openMenu('host')}>
              Become a host
            </button>
            {menu === 'host' && (
              <div className={styles.dropdown} role="menu">
                <p className={styles.dropTitle}>Host your home</p>
                <p className={styles.dropCopy}>This demo stays on the Candolim listing. Hosting tools are not connected.</p>
              </div>
            )}
          </div>
          <div className={styles.menuAnchor} ref={globeRef}>
            <button type="button" className={styles.iconButton} aria-label={`Language: ${language}`} aria-expanded={menu === 'globe'} onClick={() => openMenu('globe')}>
              <Globe size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            {menu === 'globe' && (
              <div className={styles.dropdown} role="menu">
                {['English', 'हिन्दी'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === item}
                    className={language === item ? styles.menuItemActive : styles.menuItem}
                    onClick={() => {
                      setLanguage(item);
                      setMenu(null);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.menuAnchor} ref={profileRef}>
            <button type="button" className={styles.profile} aria-label="Main menu" aria-expanded={menu === 'profile'} onClick={() => openMenu('profile')}>
              <Menu size={16} strokeWidth={2} aria-hidden="true" />
              <span className={styles.avatar}><UserRound size={16} aria-hidden="true" /></span>
            </button>
            {menu === 'profile' && (
              <div className={styles.dropdown} role="menu">
                <button type="button" role="menuitem" className={styles.menuItemStrong} onClick={() => { setMenu(null); pushToast('Browsing continues without an account'); }}>Sign up</button>
                <button type="button" role="menuitem" className={styles.menuItem} onClick={() => { setMenu(null); pushToast('Browsing continues without an account'); }}>Log in</button>
                <div className={styles.rule} />
                <button type="button" role="menuitem" className={styles.menuItem} onClick={() => { setMenu(null); pushToast('Help center is not part of this demo'); }}>Help Center</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function HomeMark() {
  return <img className={styles.homeMark} src="/images/search-home.png" alt="" />;
}
