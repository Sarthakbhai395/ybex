import { useEffect, useState, useRef } from "react";

import { motion, AnimatePresence } from "motion/react";
import AdminLayout from "./AdminLayout";
import axiosInstance from "../../api/axiosInstance";

const ACCENT = '#e4f141';
const DIM = 'rgba(255,255,255,0.08)';
const MUTED = 'rgba(255,255,255,0.5)';

const CATEGORIES = ['Brand Identity', 'Social Media', 'Campaigns', 'Product'];
const CAT_COLORS = {
  'Brand Identity': '#a78bfa',
  'Social Media':   '#60a5fa',
  'Campaigns':      '#f97316',
  'Product':        '#4ade80',
};

const inp = {
  width: '100%', padding: '0.85rem 1rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
  color: '#fff', fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s',
};
const onFocus = e => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = '0 0 0 3px rgba(228,241,65,0.07)'; };
const onBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; };

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
      {children}{required && <span style={{ color: ACCENT, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  const isValid = /^#[0-9A-Fa-f]{3,6}$/.test(value);
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="#111111"
            style={{ ...inp, paddingLeft: '2.8rem' }}
            onFocus={onFocus} onBlur={onBlur}
          />
          <div style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            width: '22px', height: '22px', borderRadius: '6px',
            background: isValid ? value : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            transition: 'background 0.2s',
          }} />
        </div>
        <input
          type="color"
          value={isValid ? value : '#111111'}
          onChange={e => onChange(e.target.value)}
          style={{ width: '44px', height: '44px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', padding: '2px' }}
        />
      </div>
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '8px', height: '6px', borderRadius: '4px', background: value, boxShadow: `0 0 12px ${value}80` }}
        />
      )}
    </div>
  );
}

/* ── Add / Edit Project Modal ── */
function ProjectModal({ open, onClose, onSave, editing }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    brandName: '', title: '', tagBadge: '', year: new Date().getFullYear().toString(),
    description: '', category: 'Brand Identity',
    bgColor: '#111111', accentColor: '#e4f141',
    stats: '', projectLink: '', sortOrder: 0,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({
          brandName: editing.brandName || '',
          title: editing.title || '',
          tagBadge: editing.tagBadge || '',
          year: editing.year || new Date().getFullYear().toString(),
          description: editing.description || '',
          category: editing.category || 'Brand Identity',
          bgColor: editing.bgColor || '#111111',
          accentColor: editing.accentColor || '#e4f141',
          stats: editing.stats || '',
          projectLink: editing.projectLink || '',
          sortOrder: editing.sortOrder ?? 0,
        });
        setCoverPreview(editing.coverImage ? (editing.coverImage.startsWith('/uploads/') ? `${axiosInstance.defaults.baseURL?.replace('/api','') || ''}${editing.coverImage}` : editing.coverImage) : null);
      } else {
        setForm({ brandName: '', title: '', tagBadge: '', year: new Date().getFullYear().toString(), description: '', category: 'Brand Identity', bgColor: '#111111', accentColor: '#e4f141', stats: '', projectLink: '', sortOrder: 0 });
        setCoverPreview(null);
      }
      setCoverFile(null);
      setErr('');
    }
  }, [open, editing]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleCoverChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = ev => setCoverPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!form.brandName.trim()) { setErr('Brand name is required'); return; }
    if (!form.title.trim())     { setErr('Title is required'); return; }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append('coverImage', coverFile);
      let res;
      if (editing) {
        res = await axiosInstance.patch(`/admin/projects/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await axiosInstance.post('/admin/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSave(res.data.project, !!editing);
      onClose();
    } catch (e) { setErr(e.response?.data?.message || 'Failed to save project'); }
    finally { setSaving(false); }
  };

  if (!open) return null;

  const previewBg = /^#[0-9A-Fa-f]{3,6}$/.test(form.bgColor) ? form.bgColor : '#111';
  const previewAccent = /^#[0-9A-Fa-f]{3,6}$/.test(form.accentColor) ? form.accentColor : '#e4f141';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1.5rem 1rem', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{ width: '100%', maxWidth: '720px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.95)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 3rem)' }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg, rgba(228,241,65,0.06) 0%, transparent 60%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(228,241,65,0.1)', border: '1px solid rgba(228,241,65,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🗂️</div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{editing ? 'Edit Project' : 'Add New Project'}</div>
                <div style={{ fontSize: '0.68rem', color: MUTED, marginTop: '2px' }}>Fill in the project details below</div>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}
            >✕</motion.button>
          </div>

          <div className="portfolio-modal-scroll" style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
            {/* Error */}
            <AnimatePresence>
              {err && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: 'rgba(255,61,16,0.08)', border: '1px solid rgba(255,61,16,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#FF3D10', fontSize: '0.82rem' }}
                >⚠ {err}</motion.div>
              )}
            </AnimatePresence>

            {/* Row 1: Brand Name + Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <Label required>Brand Name</Label>
                <input type="text" value={form.brandName} onChange={e => set('brandName', e.target.value)} placeholder="e.g. OZONE" style={inp} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label required>Title / Tagline</Label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Nature. Science. Beauty." style={inp} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Row 2: Tag Badge + Year */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <Label>Tag Badge</Label>
                <input type="text" value={form.tagBadge} onChange={e => set('tagBadge', e.target.value)} placeholder="e.g. FULL REBRAND" style={inp} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <Label>Year</Label>
                <input type="text" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024" style={inp} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief project description..." rows={3}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => {
                  const active = form.category === cat;
                  const col = CAT_COLORS[cat];
                  return (
                    <motion.button key={cat}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => set('category', cat)}
                      style={{
                        padding: '0.45rem 1rem', borderRadius: '20px', cursor: 'pointer',
                        background: active ? `${col}20` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? col : 'rgba(255,255,255,0.1)'}`,
                        color: active ? col : MUTED,
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em',
                        transition: 'all 0.15s',
                      }}
                    >{cat}</motion.button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <ColorField label="Background Color" value={form.bgColor} onChange={v => set('bgColor', v)} />
              <ColorField label="Accent Color" value={form.accentColor} onChange={v => set('accentColor', v)} />
            </div>

            {/* Color Preview Card */}
            <motion.div
              animate={{ background: previewBg }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: '16px', padding: '1.25rem 1.5rem', border: `1px solid ${previewAccent}30`, position: 'relative', overflow: 'hidden', minHeight: '80px' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 50%, ${previewAccent}15 0%, transparent 60%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: previewAccent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>{form.category || 'Category'}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: previewAccent, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{form.brandName || 'Brand Name'}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{form.title || 'Project title'}</div>
              <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{form.year}</div>
            </motion.div>

            {/* Stats */}
            <div>
              <Label>Stats</Label>
              <input type="text" value={form.stats} onChange={e => set('stats', e.target.value)} placeholder="e.g. 50+ SKUs · 3M reach" style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Project Link */}
            <div>
              <Label>Project Link</Label>
              <input type="url" value={form.projectLink} onChange={e => set('projectLink', e.target.value)} placeholder="https://..." style={inp} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Cover Image */}
            <div>
              <Label>Cover Image</Label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
              <motion.div
                whileHover={{ borderColor: ACCENT }}
                onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '14px', cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="cover" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                    >
                      <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>Click to change</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
                    <div style={{ color: MUTED, fontSize: '0.82rem', fontWeight: 600 }}>Click to select cover image</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginTop: '4px' }}>JPG, PNG, WEBP · Max 5MB</div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sort Order */}
            <div>
              <Label>Sort Order</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => set('sortOrder', Math.max(0, form.sortOrder - 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >−</motion.button>
                <div style={{ flex: 1, textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{form.sortOrder}</div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => set('sortOrder', form.sortOrder + 1)}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</motion.button>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', marginTop: '6px', textAlign: 'center' }}>Lower number = shown first</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: MUTED, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >Cancel</motion.button>
            <motion.button
              whileHover={!saving ? { scale: 1.04, boxShadow: '0 8px 28px rgba(228,241,65,0.35)' } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
              onClick={submit} disabled={saving}
              style={{ padding: '0.75rem 2rem', background: saving ? 'rgba(228,241,65,0.4)' : ACCENT, border: 'none', borderRadius: '12px', color: '#000', fontSize: '0.88rem', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {saving ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%' }} />Saving...</>
              ) : editing ? '✓ Save Changes' : '+ Add Project'}
            </motion.button>
          </div>

          <style>{`
            .portfolio-modal-scroll::-webkit-scrollbar { width: 4px; }
            .portfolio-modal-scroll::-webkit-scrollbar-track { background: transparent; }
            .portfolio-modal-scroll::-webkit-scrollbar-thumb { background: rgba(228,241,65,0.25); border-radius: 4px; }
            .portfolio-modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(228,241,65,0.5); }
            .portfolio-modal-scroll { scrollbar-width: thin; scrollbar-color: rgba(228,241,65,0.25) transparent; }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Project Card ── */
function ProjectCard({ project, index, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const bg = project.bgColor || '#111';
  const accent = project.accentColor || '#e4f141';
  const catColor = CAT_COLORS[project.category] || '#a78bfa';

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const base = axiosInstance.defaults.baseURL?.replace('/api', '') || '';
    return `${base}${img}`;
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.brandName}"?`)) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/admin/projects/${project._id}`);
      onDelete(project._id);
    } catch (e) { console.error(e); setDeleting(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, boxShadow: `0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px ${accent}30` }}
      style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', background: bg, border: `1px solid rgba(255,255,255,0.07)`, transition: 'border-color 0.2s' }}
    >
      {/* Cover image */}
      <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: bg }}>
        {getImageUrl(project.coverImage) ? (
          <motion.img
            src={getImageUrl(project.coverImage)}
            alt={project.brandName}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(ellipse at 50% 50%, ${accent}15 0%, transparent 70%)` }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: accent, opacity: 0.3, letterSpacing: '-0.04em' }}>{project.brandName?.charAt(0)}</div>
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${bg}ee 100%)`, pointerEvents: 'none' }} />
        {/* Category + Year badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
          <span style={{ background: `${catColor}22`, border: `1px solid ${catColor}55`, color: catColor, fontSize: '0.58rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', backdropFilter: 'blur(8px)' }}>
            {project.category}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '2px 8px', fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>
          {project.year}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: accent, letterSpacing: '-0.02em', marginBottom: '4px', lineHeight: 1.1 }}>{project.brandName}</div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginBottom: '8px', lineHeight: 1.4 }}>{project.title}</div>
        {project.description && (
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </div>
        )}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {project.tagBadge && (
            <span style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {project.tagBadge}
            </span>
          )}
          {project.stats && (
            <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
              {project.stats}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '6px' }}
      >
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); onEdit(project); }}
          style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(228,241,65,0.15)', border: '1px solid rgba(228,241,65,0.3)', color: ACCENT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}
        >✏️</motion.button>
        <motion.button whileHover={{ scale: 1.1, background: 'rgba(255,61,16,0.3)' }} whileTap={{ scale: 0.9 }}
          onClick={e => { e.stopPropagation(); handleDelete(); }}
          disabled={deleting}
          style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(255,61,16,0.12)', border: '1px solid rgba(255,61,16,0.25)', color: '#FF3D10', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}
        >{deleting ? '⏳' : '🗑'}</motion.button>
      </motion.div>

      {/* Sort order badge */}
      <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '1px 7px', fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
        #{project.sortOrder}
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    axiosInstance.get('/admin/projects')
      .then(({ data }) => setProjects(data.projects || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (project, isEdit) => {
    if (isEdit) {
      setProjects(p => p.map(x => x._id === project._id ? project : x));
    } else {
      setProjects(p => [project, ...p]);
    }
  };

  const handleEdit = (project) => { setEditing(project); setModalOpen(true); };
  const handleAdd  = () => { setEditing(null); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditing(null); };

  const filtered = filterCat === 'all' ? projects : projects.filter(p => p.category === filterCat);

  const counts = {
    all: projects.length,
    ...CATEGORIES.reduce((a, c) => ({ ...a, [c]: projects.filter(p => p.category === c).length }), {}),
  };

  return (
    <AdminLayout>
      <ProjectModal open={modalOpen} onClose={handleClose} onSave={handleSave} editing={editing} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(228,241,65,0.15) 0%, rgba(228,241,65,0.05) 100%)', border: '1px solid rgba(228,241,65,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 8px 32px rgba(228,241,65,0.12)' }}
            >🗂️</motion.div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>Portfolio</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }}
                />
                <span style={{ fontSize: '0.72rem', color: MUTED }}>{projects.length} project{projects.length !== 1 ? 's' : ''} · live on portfolio page</span>
              </div>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 12px 35px rgba(228,241,65,0.35)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.9rem 1.75rem', background: 'linear-gradient(135deg, #e4f141 0%, #d4e130 100%)', border: 'none', borderRadius: '14px', color: '#000', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(228,241,65,0.2)', letterSpacing: '-0.01em' }}
        >
          <span style={{ fontSize: '1.1rem' }}>+</span> Add Project
        </motion.button>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.75rem', alignItems: 'center' }}
      >
        {['all', ...CATEGORIES].map(cat => {
          const isActive = filterCat === cat;
          const col = cat === 'all' ? ACCENT : CAT_COLORS[cat];
          return (
            <motion.button key={cat}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: '0.45rem 1.1rem', borderRadius: '20px', cursor: 'pointer',
                background: isActive ? (cat === 'all' ? `${ACCENT}20` : `${col}20`) : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? col : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? col : MUTED,
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
            >
              {cat === 'all' ? 'All' : cat}
              <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '0.68rem' }}>({counts[cat] ?? 0})</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
              style={{ height: '320px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '5rem 2rem', textAlign: 'center' }}
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(228,241,65,0.3))' }}
          >🗂️</motion.div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
            {filterCat === 'all' ? 'No projects yet' : `No ${filterCat} projects`}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            {filterCat === 'all' ? 'Click Add Project to create your first portfolio entry.' : 'Try a different category or add a new project.'}
          </div>
          {filterCat !== 'all' && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setFilterCat('all')}
              style={{ padding: '0.6rem 1.4rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: MUTED, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
            >Show all</motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}
        >
          <AnimatePresence>
            {filtered.map((p, i) => (
              <ProjectCard
                key={p._id}
                project={p}
                index={i}
                onEdit={handleEdit}
                onDelete={id => setProjects(prev => prev.filter(x => x._id !== id))}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AdminLayout>
  );
}
