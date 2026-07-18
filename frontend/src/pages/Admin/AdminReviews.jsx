import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const ACCENT = '#e4f141';
const DIM    = 'rgba(255,255,255,0.1)';
const MUTED  = 'rgba(255,255,255,0.55)';
const CARD_BG = 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)';

const inp = {
  width: '100%',
  padding: '0.8rem 1.0rem',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${DIM}`,
  borderRadius: '12px',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const focus = (e) => {
  e.target.style.borderColor = ACCENT;
  e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.08)';
};

const blur = (e) => {
  e.target.style.borderColor = DIM;
  e.target.style.boxShadow = 'none';
};

// Canvas-based client-side image compression
const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function AddReviewModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    customRole: '',
    followers: '',
    quote: '',
    stars: 5,
    avatar: '',
    since: 'Since 2022',
    published: true
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: '',
        role: 'Creator',
        customRole: '',
        followers: '',
        quote: '',
        stars: 5,
        avatar: '',
        since: 'Since 2022',
        published: true
      });
      setErr('');
    }
  }, [open]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const compressed = await compressImage(file, 250, 250, 0.85);
      setForm(prev => ({ ...prev, avatar: compressed }));
    } catch (e) {
      setErr('Error loading/compressing image. Try another file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return setErr('Name is required');
    if (!form.quote.trim()) return setErr('Review message is required');

    const finalRole = form.role === 'Other' ? form.customRole.trim() : form.role;
    if (!finalRole) return setErr('Position/Role is required');

    setSaving(true);
    setErr('');

    try {
      const res = await axiosInstance.post('/admin/reviews', {
        name: form.name.trim(),
        role: finalRole,
        followers: form.followers.trim(),
        quote: form.quote.trim(),
        stars: form.stars,
        avatar: form.avatar || null,
        since: form.since,
        published: form.published
      });
      onAdd(res.data.review);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || 'Error adding review');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const roles = [
    'Creator',
    'Lifestyle Creator',
    'Fashion Creator',
    'Tech Creator',
    'Co-founder',
    'CEO',
    'Brand Partner',
    'Brand Ambassador',
    'Marketing Head',
    'Other'
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#0e0e0e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(0,0,0,0.85)',
              margin: 'auto'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.4rem 1.6rem',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(228,241,65,0.04)'
            }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>Create Review</div>
                <div style={{ fontSize: '0.68rem', color: MUTED, marginTop: '2px' }}>Upload local photo and fill required fields</div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >✕</motion.button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
              {err && (
                <div style={{
                  background: 'rgba(255,61,16,0.1)',
                  border: '1px solid rgba(255,61,16,0.3)',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  color: '#FF3D10',
                  fontSize: '0.8rem'
                }}>⚠ {err}</div>
              )}

              {/* Profile Image (File selection) */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Profile Image <span style={{ color: ACCENT }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="review-image-file-input"
                  />
                  <label
                    htmlFor="review-image-file-input"
                    style={{
                      padding: '0.65rem 1.2rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    {uploading ? 'Processing...' : 'Choose File'}
                  </label>
                  {form.avatar && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ position: 'relative' }}>
                      <img
                        src={form.avatar}
                        alt="Preview"
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ACCENT}` }}
                      />
                      <button
                        onClick={() => setForm(p => ({ ...p, avatar: '' }))}
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          background: '#FF3D10',
                          border: 'none',
                          color: '#fff',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          fontSize: '0.6rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >✕</button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Name <span style={{ color: ACCENT }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anshika Thapa"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inp}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>

              {/* Dropdown Position */}
              <div style={{ display: 'grid', gridTemplateColumns: form.role === 'Other' ? '1fr 1fr' : '1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Position / Role <span style={{ color: ACCENT }}>*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{
                      ...inp,
                      background: 'rgba(255,255,255,0.04) url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e") no-repeat right 12px center/18px',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                    onFocus={focus}
                    onBlur={blur}
                  >
                    {roles.map(r => <option key={r} value={r} style={{ background: '#0e0e0e', color: '#fff' }}>{r}</option>)}
                  </select>
                </div>
                {form.role === 'Other' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Specify Role <span style={{ color: ACCENT }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CFO"
                      value={form.customRole}
                      onChange={(e) => setForm({ ...form, customRole: e.target.value })}
                      style={inp}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </motion.div>
                )}
              </div>

              {/* Followers / Company */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Tagline / Followers / Company <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50K+ Followers, Brand Partner, CEO of Nike"
                  value={form.followers}
                  onChange={(e) => setForm({ ...form, followers: e.target.value })}
                  style={inp}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>

              {/* Star Rating (Interactive Stars) */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Rating (Stars)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setForm(p => ({ ...p, stars: s }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <svg
                        style={{ width: '32px', height: '32px', fill: s <= form.stars ? ACCENT : 'rgba(255,255,255,0.15)', transition: 'fill 0.2s' }}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Review Message */}
              <div>
                <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Review Description <span style={{ color: ACCENT }}>*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste the client's story / testimonial here..."
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  style={{ ...inp, resize: 'none', height: '90px' }}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {/* Since Year */}
                <div>
                  <label style={{ display: 'block', color: MUTED, fontSize: '0.68rem', fontWeight: 700, marginBottom: '0.45rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Since Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Since 2022"
                    value={form.since}
                    onChange={(e) => setForm({ ...form, since: e.target.value })}
                    style={inp}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </div>

                {/* Published option */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.85rem', marginTop: '15px' }}>
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: ACCENT,
                        cursor: 'pointer'
                      }}
                    />
                    Publish Review
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1.0rem 1.6rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              gap: '0.65rem',
              justifyContent: 'flex-end',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <button onClick={onClose} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <motion.button
                whileHover={!saving ? { scale: 1.03, boxShadow: '0 6px 20px rgba(228,241,65,0.25)' } : {}}
                whileTap={!saving ? { scale: 0.97 } : {}}
                onClick={handleSubmit} disabled={saving || uploading}
                style={{ padding: '0.6rem 1.4rem', background: saving || uploading ? 'rgba(228,241,65,0.4)' : ACCENT, border: 'none', borderRadius: '9px', color: '#000', fontSize: '0.82rem', fontWeight: 800, cursor: saving || uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {saving ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }} />
                    Publishing...
                  </>
                ) : 'Publish Review'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReviewCard({ review, index, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/reviews/${review._id}`);
      onDelete(review._id);
    } catch (e) {
      console.error(e);
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <DeleteConfirmModal
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Review"
        message={`Review from "${review.name}" will be permanently removed.`}
      />

      <div
        className="ganox-review-card-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative' }}
      >
        <div className="ganox-review-card">
          <div>
            <div className="card-header-row">
              {review.avatar ? (
                <img src={review.avatar} alt={review.name} className="card-avatar" />
              ) : (
                <div className="card-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e0e', fontSize: '1.5rem' }}>👤</div>
              )}
              <div className="card-reviewer-info">
                <h4 className="card-reviewer-name">{review.name}</h4>
                <p className="card-reviewer-role" style={{ color: '#888' }}>
                  {review.role} {review.followers && <span style={{ color: '#555', fontWeight: 700 }}>• {review.followers}</span>}
                </p>
              </div>
            </div>
            <p className="card-quote-text" style={{ fontSize: '0.88rem', color: '#222', lineHeight: '1.6' }}>{review.quote}</p>
          </div>
          <div className="card-footer-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div className="card-stars-row" style={{ display: 'flex', gap: '3px' }}>
              {[...Array(review.stars || 5)].map((_, i) => (
                <svg key={i} className="card-star-icon" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: '#E4F141' }}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <div className="card-badge-since" style={{ background: '#E4F141', color: '#000', padding: '5px 12px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
              {review.since || 'Since 2022'}
            </div>
          </div>
        </div>

        {/* Delete Button overlaid */}
        <motion.button
          whileHover={{ scale: 1.15, background: 'rgba(255,61,16,0.95)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setConfirmOpen(true)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,61,16,0.4)',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s, background 0.2s',
            color: '#ff6b35',
            zIndex: 10
          }}
        >
          🗑
        </motion.button>

        {!review.published && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(255,61,16,0.15)',
            border: '1px solid rgba(255,61,16,0.3)',
            borderRadius: '6px',
            padding: '3px 8px',
            fontSize: '0.6rem',
            fontWeight: 800,
            color: '#FF3D10',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Unpublished
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get('/admin/reviews')
      .then((res) => setReviews(res.data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <style>{`
        /* Reviews card styling for previewing exact design */
        .ganox-review-card {
          width: 320px;
          min-height: 280px;
          background: #f8f8f6;
          border-radius: 0 20px 0 0;
          padding: 24px 22px 20px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          position: relative;
          clip-path: polygon(
            0% 0%, 100% 0%,
            100% 100%,
            97% 99.5%, 95% 100%, 92% 99.1%, 90% 100%, 87% 99.4%,
            85% 100%, 82% 98.9%, 80% 100%, 77% 99.3%, 74% 100%,
            72% 99.6%, 69% 100%, 67% 98.8%, 64% 100%, 62% 99.2%,
            59% 100%, 57% 99.5%, 54% 100%, 51% 98.9%, 49% 100%,
            46% 99.4%, 44% 100%, 41% 99.1%, 38% 100%, 36% 99.6%,
            33% 100%, 31% 98.8%, 28% 100%, 25% 99.3%, 23% 100%,
            20% 99.5%, 18% 100%, 15% 99.1%, 12% 100%, 10% 99.4%,
            7% 100%, 5% 98.9%, 3% 100%, 1% 99.3%, 0% 100%,
            1.5% 97%, 0.3% 95%, 2.2% 93%, 0% 91.5%, 1.8% 89%,
            0.5% 87%, 2.5% 85%, 0.2% 83.5%, 1.4% 81%, 0% 79%,
            2.1% 77%, 0.6% 75.5%, 1.9% 73%, 0.1% 71%, 2.3% 69%,
            0.4% 67.5%, 1.6% 65%, 0% 63%, 2.4% 61%, 0.3% 59.5%,
            1.7% 57%, 0.5% 55%, 2.0% 53%, 0.1% 51.5%, 1.3% 49%,
            0% 47%, 2.2% 45%, 0.6% 43.5%, 1.8% 41%, 0.2% 39%,
            2.5% 37%, 0.4% 35.5%, 1.5% 33%, 0% 31%, 2.1% 29%,
            0.3% 27.5%, 1.9% 25%, 0.5% 23%, 2.3% 21%, 0.1% 19.5%,
            1.6% 17%, 0% 15%, 2.0% 13%, 0.4% 11.5%, 1.4% 9%,
            0.2% 7%, 2.4% 5%, 0.6% 3.5%, 1.8% 2%, 0% 0%
          );
        }

        .card-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .card-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #E4F141;
          object-fit: cover;
          flex-shrink: 0;
        }

        .card-reviewer-info {
          display: flex;
          flex-direction: column;
        }

        .card-reviewer-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #E4F141;
          margin: 0;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        .card-reviewer-role {
          font-size: 0.75rem;
          color: #888888;
          margin: 3px 0 0 0;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          font-weight: 500;
        }
      `}</style>

      <AddReviewModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={(rev) => setReviews(r => [rev, ...r])} />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <motion.div 
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, rgba(228,241,65,0.15) 0%, rgba(228,241,65,0.05) 100%)',
                border: '1px solid rgba(228,241,65,0.25)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 8px 32px rgba(228,241,65,0.15)',
              }}
            >📝</motion.div>
            <h1 style={{ 
              fontSize: '1.6rem', 
              fontWeight: 800, 
              color: '#fff', 
              margin: 0,
              letterSpacing: '-0.03em',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>Reviews</h1>
          </div>
          <p style={{ color: MUTED, fontSize: '0.85rem', paddingLeft: '56px', margin: 0 }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''} · shown in homepage testimonials</p>
        </div>

        {/* Animated attract button */}
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 12px 35px rgba(228,241,65,0.45)' }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '0.9rem 1.7rem', 
            background: 'linear-gradient(135deg, #e4f141 0%, #b2bd1b 100%)', 
            border: 'none', 
            borderRadius: '14px', 
            color: '#000', 
            fontSize: '0.92rem', 
            fontWeight: 800, 
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(228,241,65,0.25)',
          }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block' }}
          >⚙</motion.span>
          Create Review
        </motion.button>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
              style={{ width: '320px', height: '280px', borderRadius: '0 20px 0 0', background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: CARD_BG, 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '24px', 
            padding: '5rem 2rem', 
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📝</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>No reviews uploaded yet</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Click "Create Review" to publish the first story.</div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}
        >
          <AnimatePresence>
            {reviews.map((rev, i) => (
              <ReviewCard key={rev._id} review={rev} index={i} onDelete={(id) => setReviews(prev => prev.filter(r => r._id !== id))} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}
