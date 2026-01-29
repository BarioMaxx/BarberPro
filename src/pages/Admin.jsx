import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '' });

  const url = useMemo(() => (q.trim() ? `/api/customers?q=${encodeURIComponent(q.trim())}` : '/api/customers'), [q]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load customers');
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      load();
    }, 200);
    return () => clearTimeout(t);
  }, [url]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create customer');
      setForm({ name: '', phone: '', email: '', comment: '' });
      await load();
    } catch (e2) {
      alert(e2.message || 'Failed');
    }
  };

  const update = async (id, patch) => {
    try {
      const existing = customers.find((c) => c._id === id);
      if (!existing) return;
      const payload = {
        name: existing.name,
        phone: existing.phone,
        email: existing.email,
        comment: existing.comment,
        ...patch,
      };
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (e) {
      alert(e.message || 'Update failed');
    }
  };

  const onCommentChange = (id, value) => {
    setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, comment: value } : c)));
  };

  return (
    <div className="container">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Heritage Blade Home" style={{ textDecoration: 'none' }}>
          <div className="logo">AB</div>
          <div>
            <strong>Heritage Blade</strong>
            <div className="muted-small">Admin — Customers</div>
          </div>
        </Link>
        <nav className="nav-actions" aria-label="admin-actions">
          <Link to="/" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Site
          </Link>
        </nav>
      </header>

      <section className="panel" aria-labelledby="admin-title">
        <h1 id="admin-title" style={{ margin: 0, marginBottom: 12, fontSize: 22 }}>
          Customers
        </h1>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search name, phone, email"
            style={{ flex: 1, minWidth: 260 }}
          />
          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>

        <div className="panel" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>Add Customer</h2>
          <form className="booking-form" onSubmit={create}>
            <div className="form-grid">
              <div className="form-row">
                <label htmlFor="c-name">Full name</label>
                <input
                  id="c-name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="c-phone">Phone</label>
                <input
                  id="c-phone"
                  type="tel"
                  placeholder="+254..."
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  type="email"
                  placeholder="you@domain.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="c-comment">Comment</label>
              <textarea
                id="c-comment"
                placeholder="Staff notes, preferences, etc."
                value={form.comment}
                onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-book">
                Save Customer
              </button>
            </div>
          </form>
        </div>

        <div className="panel">
          <h2 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>All Customers</h2>
          <div className="muted-small" style={{ marginBottom: 8 }}>
            Edit comments and click outside the field to save.
          </div>

          {loading ? (
            <div className="muted">Loading…</div>
          ) : error ? (
            <div className="muted">Error: {error}</div>
          ) : customers.length === 0 ? (
            <div className="muted">No customers yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: 8 }}>Name</th>
                    <th style={{ padding: 8 }}>Phone</th>
                    <th style={{ padding: 8 }}>Email</th>
                    <th style={{ padding: 8 }}>Comment</th>
                    <th style={{ padding: 8 }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id}>
                      <td style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>{c.name || ''}</td>
                      <td style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>{c.phone || ''}</td>
                      <td style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>{c.email || ''}</td>
                      <td style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <input
                          value={c.comment || ''}
                          onChange={(e) => onCommentChange(c._id, e.target.value)}
                          onBlur={(e) => update(c._id, { comment: e.target.value })}
                          style={{
                            width: '100%',
                            padding: 8,
                            borderRadius: 8,
                            background: 'var(--glass)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            color: 'var(--text)',
                          }}
                        />
                      </td>
                      <td style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
