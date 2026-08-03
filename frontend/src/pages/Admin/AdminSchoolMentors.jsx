import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const ACCENT = '#8b5cf6'; // Purple accent matching School Mentors tab theme
const ACCENT_YELLOW = '#e4f141';
const BORDER = 'rgba(255,255,255,0.08)';
const MUTED  = 'rgba(255,255,255,0.55)';
const DIM    = 'rgba(255,255,255,0.12)';

const inpStyle = {
  width: '100%',
  padding: '0.85rem 1.1rem',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${DIM}`,
  borderRadius: '14px',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const focus = (e) => {
  e.target.style.borderColor = ACCENT;
  e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
};

const blur = (e) => {
  e.target.style.borderColor = DIM;
  e.target.style.boxShadow = 'none';
};

// Canvas-based image compressor
const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.82) => {
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

function MentorModal({ open, mentor, onClose, onSave }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [track, setTrack] = useState('Content Creation');
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const [expertise, setExpertise] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (open) {
      if (mentor) {
        setName(mentor.name || '');
        setRole(mentor.role || '');
        setBio(mentor.bio || '');
        setTrack(mentor.track || 'Content Creation');
        setImageUrl(mentor.imageUrl || '');
        setEmail(mentor.email || '');
        setPhone(mentor.phone || '');
        setStatus(mentor.status || 'active');
        setExpertise(Array.isArray(mentor.expertise) ? mentor.expertise.join(', ') : '');
      } else {
        setName('');
        setRole('');
        setBio('');
        setTrack('Content Creation');
        setImageUrl('');
        setEmail('');
        setPhone('');
        setStatus('active');
        setExpertise('');
      }
      setErr('');
    }
  }, [open, mentor]);

  if (!open) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const compressed = await compressImage(file);
      setImageUrl(compressed);
    } catch {
      setErr('Failed to compress/process image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErr('Mentor Name is required.');
    if (!role.trim()) return setErr('Role/Title is required.');

    setSaving(true);
    setErr('');

    const payload = {
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      track,
      imageUrl: imageUrl.trim() || null,
      email: email.trim(),
      phone: phone.trim(),
      status,
      expertise: expertise.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (mentor) {
        const res = await axiosInstance.patch(`/admin/school-mentors/${mentor._id}`, payload);
        onSave(res.data.mentor, false);
      } else {
        const res = await axiosInstance.post('/admin/school-mentors', payload);
        onSave(res.data.mentor, true);
      }
      onClose();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to save mentor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          style={{
            background: '#0e0e12',
            border: `1px solid ${BORDER}`,
            borderRadius: '24px',
            padding: '2rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>
              {mentor ? '✏️ Edit School Mentor' : '🎓 Add School Mentor'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
          </div>

          {err && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                FULL NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Ravi Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inpStyle} onFocus={focus} onBlur={blur}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                  ROLE / TITLE *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder of YBEX"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={inpStyle} onFocus={focus} onBlur={blur}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                  CURRICULUM TRACK
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  style={{ ...inpStyle, cursor: 'pointer', background: '#14141c' }}
                  onFocus={focus} onBlur={blur}
                >
                  <option value="Content Creation">Content Creation</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Growth & Strategy">Growth & Strategy</option>
                  <option value="Full Stack Creator">Full Stack Creator</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                PROFILE / AVATAR IMAGE
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: `1px solid ${ACCENT}` }} />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: '1.2rem' }}>
                    🎓
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ fontSize: '0.8rem', color: MUTED }}
                  />
                  {uploading && <span style={{ fontSize: '0.75rem', color: ACCENT_YELLOW }}>Compressing...</span>}
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                BIO / BACKGROUND
              </label>
              <textarea
                rows={3}
                placeholder="Brief introduction about mentor's achievements and teaching focus..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ ...inpStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="mentor@ybex.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inpStyle} onFocus={focus} onBlur={blur}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                  PHONE NUMBER
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inpStyle} onFocus={focus} onBlur={blur}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                EXPERTISE TAGS (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Premiere Pro, Storyboarding, Paid Ads"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                style={inpStyle} onFocus={focus} onBlur={blur}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: MUTED, marginBottom: '0.35rem', fontWeight: 600 }}>
                STATUS
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="status" value="active" checked={status === 'active'} onChange={() => setStatus('active')} />
                  Active (Displayed)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: MUTED, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" name="status" value="inactive" checked={status === 'inactive'} onChange={() => setStatus('inactive')} />
                  Inactive
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${DIM}`, borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                style={{ padding: '0.75rem 1.5rem', background: ACCENT, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: `0 0 15px ${ACCENT}44` }}
              >
                {saving ? 'Saving...' : mentor ? 'Update Mentor' : 'Save Mentor'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminSchoolMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [deletingMentor, setDeletingMentor] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fallback initial data if server has 0 entries
  const initialFallback = [
    { _id: 'm1', name: 'Ravi Kumar', role: 'FOUNDER OF YBEX', track: 'Content Creation', bio: 'Expert in viral hook storytelling and high retention video editing.', status: 'active', expertise: ['Storytelling', 'Editing', 'Branding'] },
    { _id: 'm2', name: 'Sharadh Sharma', role: 'FOUNDER OF GUTARGOO+', track: 'Digital Marketing', bio: 'Pioneer in performance funnels and paid ad architectures.', status: 'active', expertise: ['Ads', 'Funnels', 'CRO'] },
  ];

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/school-mentors');
      if (res.data?.success && res.data.mentors?.length > 0) {
        setMentors(res.data.mentors);
      } else {
        setMentors(initialFallback);
      }
    } catch {
      setMentors(initialFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSave = (savedMentor, isNew) => {
    if (isNew) {
      setMentors((prev) => [savedMentor, ...prev]);
    } else {
      setMentors((prev) => prev.map((m) => (m._id === savedMentor._id ? savedMentor : m)));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMentor) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/school-mentors/${deletingMentor._id}`);
      setMentors((prev) => prev.filter((m) => m._id !== deletingMentor._id));
      setDeletingMentor(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete mentor');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
                          m.role?.toLowerCase().includes(search.toLowerCase()) ||
                          m.bio?.toLowerCase().includes(search.toLowerCase());
    const matchesTrack = selectedTrack === 'ALL' || m.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🎓 School Mentors
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: MUTED, fontSize: '0.85rem' }}>
              Manage school mentor profiles, tracks, and student assignments.
            </p>
          </div>

          <button
            onClick={() => { setEditingMentor(null); setModalOpen(true); }}
            style={{
              padding: '0.75rem 1.25rem',
              background: ACCENT,
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: `0 0 20px ${ACCENT}44`,
              transition: 'all 0.2s ease',
            }}
          >
            <span>+</span> Add School Mentor
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center',
          background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`,
          borderRadius: '16px', padding: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="🔍 Search mentors by name, role or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inpStyle} onFocus={focus} onBlur={blur}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'Content Creation', 'Digital Marketing', 'Growth & Strategy', 'Full Stack Creator'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTrack(t)}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '10px',
                  border: `1px solid ${selectedTrack === t ? ACCENT : BORDER}`,
                  background: selectedTrack === t ? `${ACCENT}25` : 'rgba(255,255,255,0.03)',
                  color: selectedTrack === t ? '#fff' : MUTED,
                  fontSize: '0.78rem',
                  fontWeight: selectedTrack === t ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content list / grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: MUTED }}>
            Loading school mentors...
          </div>
        ) : filteredMentors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: 'rgba(255,255,255,0.01)', border: `1px dashed ${BORDER}`, borderRadius: '20px' }}>
            <p style={{ color: MUTED, fontSize: '0.95rem' }}>No school mentors found matching your filter.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredMentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '20px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {mentor.imageUrl ? (
                    <img
                      src={mentor.imageUrl}
                      alt={mentor.name}
                      style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover', border: `1px solid ${ACCENT}55` }}
                    />
                  ) : (
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '16px',
                      background: `linear-gradient(135deg, ${ACCENT}33, rgba(228,241,65,0.2))`,
                      border: `1px solid ${ACCENT}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '1.3rem', fontWeight: 800
                    }}>
                      {mentor.name?.charAt(0) || 'M'}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mentor.name}
                      </h3>
                      <span style={{
                        padding: '0.2rem 0.5rem', borderRadius: '6px',
                        fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                        background: mentor.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: mentor.status === 'active' ? '#4ade80' : '#f87171',
                        border: `1px solid ${mentor.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                      }}>
                        {mentor.status}
                      </span>
                    </div>

                    <div style={{ color: ACCENT_YELLOW, fontSize: '0.75rem', fontWeight: 600, marginTop: '2px' }}>
                      {mentor.role}
                    </div>

                    <div style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      padding: '0.15rem 0.55rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '6px',
                      color: MUTED,
                      fontSize: '0.7rem'
                    }}>
                      {mentor.track}
                    </div>
                  </div>
                </div>

                {mentor.bio && (
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {mentor.bio}
                  </p>
                )}

                {mentor.expertise?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {mentor.expertise.map((tag, idx) => (
                      <span key={idx} style={{ padding: '0.15rem 0.45rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '6px', color: '#c084fc', fontSize: '0.68rem', fontWeight: 600 }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${BORDER}` }}>
                  <button
                    onClick={() => { setEditingMentor(mentor); setModalOpen(true); }}
                    style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: '8px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setDeletingMentor(mentor)}
                    style={{ padding: '0.4rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit */}
        <MentorModal
          open={modalOpen}
          mentor={editingMentor}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />

        {/* Soft Delete Modal */}
        {deletingMentor && (
          <DeleteConfirmModal
            isOpen={Boolean(deletingMentor)}
            title="Delete School Mentor"
            message={`Are you sure you want to delete "${deletingMentor.name}"? This mentor will be moved to the Bin.`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingMentor(null)}
            loading={deleting}
          />
        )}
      </div>
    </AdminLayout>
  );
}
