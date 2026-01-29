import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BookingModal, { SERVICES } from '../components/BookingModal.jsx';
import SocialLinks from '../components/SocialLinks.jsx';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [presetService, setPresetService] = useState(null);

  const cards = useMemo(
    () => [
      { title: 'Fade / Taper', price: 'High & Low • KES 700', serviceStartsWith: 'Fade / Taper' },
      { title: 'Twists', price: 'Premium styling • KES 1,500', serviceStartsWith: 'Twists' },
      { title: 'Cornrows', price: 'Expert braiding • KES 1,500', serviceStartsWith: 'Cornrows' },
      { title: 'Finger Coils', price: 'Signature style • KES 2,000', serviceStartsWith: 'Finger Coils' },
    ],
    []
  );

  const openBooking = (serviceStartsWith) => {
    const s = SERVICES.find((x) => x.startsWith(serviceStartsWith)) || null;
    setPresetService(s);
    setOpen(true);
  };

  return (
    <>
      <div className="container">
        <header className="site-header">
          <a className="brand" href="https://heritageblade.bario.me/" aria-label="Heritage Blade Home">
            <div className="logo">AB</div>
            <div>
              <strong>Heritage Blade</strong>
              <div className="muted-small">Premium grooming in Kenya</div>
            </div>
          </a>
          <nav className="nav-actions" aria-label="primary">
            <a
              href="https://www.instagram.com/_heritage_blade/"
              className="btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram - Heritage Blade"
            >
              <span className="icon">📷</span>Instagram
            </a>
            <a href="tel:+254714343855" className="btn-ghost phone-btn" aria-label="Call +2547 14 343 855">
              <span className="icon">📞</span>+2547 14 343 855
            </a>
            <button className="btn-book" type="button" onClick={() => openBooking(null)}>
              <span className="icon">✂️</span>Book Now
            </button>
          </nav>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="panel">
            <h1 id="hero-title">Fresh cuts. Premium experience.</h1>
            <p className="lead">
              Book your appointment with Heritage Blade's expert barbers. Professional grooming services in Kenya.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-book booking-btn" type="button" onClick={() => openBooking(null)}>
                <span className="icon">⚡</span>Book Now
              </button>
              <a
                href="tel:+254714343855"
                className="btn-ghost"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <span className="icon">📞</span>Call Us
              </a>
              <Link to="/admin" className="btn-ghost" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="icon">🛠️</span>Admin
              </Link>
            </div>
          </div>

          <aside className="panel" aria-label="featured services">
            <div className="cards">
              {cards.map((c) => (
                <div key={c.title} className="card" role="button" tabIndex={0} onClick={() => openBooking(c.serviceStartsWith)}>
                  <h3>{c.title}</h3>
                  <div className="muted">{c.price}</div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="panel" aria-labelledby="showcase-title" style={{ marginTop: 24 }}>
          <h2 id="showcase-title" style={{ margin: 0, marginBottom: 12, fontSize: 20 }}>
            Cuts & Styles Showcase
          </h2>
          <div className="cards">
            {cards.map((c) => (
              <div key={c.title + '-show'} className="card">
                <h3>{c.title}</h3>
                <div className="muted">Watch examples on Instagram</div>
                <a
                  href="https://www.instagram.com/_heritage_blade/reels/"
                  className="btn-ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${c.title} reels on Instagram`}
                >
                  <span className="icon">🎥</span>Watch on Instagram
                </a>
              </div>
            ))}
          </div>
          <div className="muted-small" style={{ marginTop: 8 }}>
            Tip: Replace these links with specific post URLs to highlight exact examples.
          </div>
        </section>

        <section className="contact-section panel" style={{ marginTop: 24 }}>
          <h2 style={{ margin: 0, marginBottom: 12, fontSize: 20 }}>Get in Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon" style={{ fontSize: 24 }}>
                📞
              </span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--accent-2)' }}>Reception Line</div>
                <a
                  href="tel:+254714343855"
                  style={{ color: 'var(--text)', textDecoration: 'none', fontSize: 18, fontWeight: 600 }}
                >
                  +2547 14 343 855
                </a>
                <div className="muted-small">Call us for appointments & inquiries</div>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon" style={{ fontSize: 24 }}>
                📍
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>Location</div>
                <div className="muted">Moi avenue, Moi, Nairobi Area, Kenya 00100</div>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon" style={{ fontSize: 24 }}>
                🕒
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>Hours</div>
                <div className="muted">Mon-Sat: 8AM - 8PM</div>
                <div className="muted">Sunday: 9AM - 6PM</div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel" aria-labelledby="follow-title" style={{ marginTop: 24 }}>
          <h2 id="follow-title" style={{ margin: 0, marginBottom: 12, fontSize: 20 }}>
            Follow Us
          </h2>
          <p className="muted" style={{ margin: 0, marginBottom: 12 }}>
            See our latest cuts, reels, and behind-the-scenes.
          </p>
          <SocialLinks />
        </section>

        <footer
          className="muted-small"
          style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>© 2026 Heritage Blade • Made in Kenya 🇰🇪</span>
          <div>
            <a
              href="https://www.instagram.com/_heritage_blade/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--muted)',
                textDecoration: 'none',
                fontSize: 12,
                opacity: 0.5,
                transition: 'opacity 0.2s ease',
                marginRight: 12,
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '0.5')}
            >
              Instagram
            </a>
            <Link
              to="/admin"
              style={{
                color: 'var(--muted)',
                textDecoration: 'none',
                fontSize: 12,
                opacity: 0.5,
                transition: 'opacity 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '0.5')}
            >
              Admin
            </Link>
          </div>
        </footer>
      </div>

      <BookingModal open={open} onClose={() => setOpen(false)} presetService={presetService} />
    </>
  );
}
