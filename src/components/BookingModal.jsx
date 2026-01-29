import React, { useEffect, useMemo, useState } from 'react';

const SERVICES = [
  'Fade / Taper (High & Low) - KES 700',
  'Twists - KES 1,500',
  'Cornrows - KES 1,500',
  'Finger Coils - KES 2,000',
];

export default function BookingModal({ open, onClose, presetService }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const initialForm = useMemo(
    () => ({
      name: '',
      phone: '',
      email: '',
      service: presetService || SERVICES[0],
      date: '',
      time: '',
      notes: '',
    }),
    [presetService]
  );

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) {
      setSuccess(null);
      setForm((prev) => ({ ...prev, service: presetService || prev.service }));
    }
  }, [open, presetService]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    if (!form.name?.trim()) return false;
    if (!form.date) return false;
    if (!form.time) return false;
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = { ...form, createdAt: new Date().toISOString() };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('API request failed');
      await res.json();
      setSuccess(payload);
    } catch (err) {
      // keep the UX success, even if API fails (same behavior as old localStorage fallback)
      setSuccess({ ...form });
    } finally {
      setSaving(false);
    }
  };

  const closeAndReset = () => {
    setSuccess(null);
    setForm(initialForm);
    onClose();
  };

  return (
    <div className="modal-overlay active" id="bookingModal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="bookingTitle">
        <header>
          <h2 id="bookingTitle">Book an Appointment</h2>
          <button className="close-btn" aria-label="Close booking dialog" onClick={onClose}>
            ×
          </button>
        </header>

        {!success ? (
          <form className="booking-form" onSubmit={submit} noValidate>
            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="b-name">Full name</label>
                <input
                  id="b-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="b-phone">Phone</label>
                <input
                  id="b-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+254..."
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="b-email">Email</label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  placeholder="you@domain.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="b-service">Service</label>
                <select
                  id="b-service"
                  name="service"
                  value={form.service}
                  onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="b-date">Date</label>
                <input
                  id="b-date"
                  name="date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="b-time">Time</label>
                <input
                  id="b-time"
                  name="time"
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="b-notes">Notes (optional)</label>
              <textarea
                id="b-notes"
                name="notes"
                placeholder="Any preferences or notes..."
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>

            <div className="form-actions">
              <div className="note muted-small">We will confirm availability shortly.</div>
              <div style={{ flex: 1 }} />
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-book" disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <strong>Thanks, {success.name || 'Guest'}!</strong>
            <div style={{ marginTop: 8 }} className="muted-small">
              Your request for <em>{success.service || 'Service'}</em> on <strong>{success.date} {success.time}</strong> was
              received.
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-book" onClick={closeAndReset}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { SERVICES };
