// CACHE_BUST: 2025-05-08-1430 - FORCE_RELOAD
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import AdminLayout from "./AdminLayout";
import axiosInstance from "../../api/axiosInstance";
import {
  Briefcase, Mail, Phone, Link2, FileText,
  CheckCircle, XCircle, Clock, Trash2, RefreshCw,
  Search, ExternalLink, ChevronDown, Download, Eye,
  X, Calendar, TrendingUp, Users, Filter, SortAsc, SortDesc,
} from "lucide-react";

const STATUS = {
  pending:  { bg: 'rgba(250,204,21,0.12)', color: '#facc15', border: 'rgba(250,204,21,0.3)',  label: 'Pending',  dot: '#facc15' },
  accepted: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80', border: 'rgba(74,222,128,0.3)',  label: 'Accepted', dot: '#4ade80' },
  rejected: { bg: 'rgba(255,61,16,0.12)',  color: '#FF3D10', border: 'rgba(255,61,16,0.3)',   label: 'Rejected', dot: '#FF3D10' },
};

const POSITIONS = [
  'Creative Designer', 'Video Editor', 'Content Creator',
  'Social Media Manager', 'Digital Marketer', 'Copywriter',
  'Brand Strategist', 'Other',
];

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
function fmtDateFull(d) {
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function exportCSV(apps) {
  const headers = ['Name', 'Email', 'Phone', 'Position', 'Status', 'Resume', 'Portfolio', 'Message', 'Applied On'];
  const rows = apps.map(a => [
    a.name, a.email, a.phone, a.position, a.status,
    a.resumeLink, a.portfolioLink,
    (a.message || '').replace(/,/g, ';').replace(/\n/g, ' '),
    fmtDate(a.createdAt),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const el = document.createElement('a');
  el.href = url; el.download = `hiring-${Date.now()}.csv`;
  el.click(); URL.revokeObjectURL(url);
}

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}22`,
        borderRadius: '14px',
        padding: '1.1rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ color, marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: '3px', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    </motion.div>
  );
}

function DetailModal({ app, onClose, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false);
  const st = STATUS[app.status] || STATUS.pending;

  const handleStatus = async (s) => {
    if (s === app.status) return;
    setUpdating(true);
    await onStatusChange(app._id, s);
    setUpdating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{
          width: '100%', maxWidth: '600px',
          background: 'linear-gradient(160deg, #0c0c0c 0%, #111 100%)',
          border: `1px solid ${st.color}30`,
          borderRadius: '22px', overflow: 'hidden',
          boxShadow: `0 40px 80px rgba(0,0,0,0.85), 0 0 60px ${st.color}10`,
          position: 'relative',
        }}
      >
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${st.color}, ${st.color}40, transparent)` }} />
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        ><X size={14} /></button>

        <div style={{ padding: '1.75rem 2rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
              background: `linear-gradient(135deg, ${st.color}30, ${st.color}10)`,
              border: `1px solid ${st.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 900, color: st.color,
            }}>
              {app.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>{app.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {app.position && (
                  <span style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontSize: '0.65rem', fontWeight: 800, padding: '2px 10px', borderRadius: '20px', border: '1px solid rgba(167,139,250,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {app.position}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: st.bg, color: st.color, fontSize: '0.65rem', fontWeight: 800, padding: '2px 10px', borderRadius: '20px', border: `1px solid ${st.border}`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
                  {st.label}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { icon: <Mail size={13} />, label: 'Email', value: app.email, href: `mailto:${app.email}` },
              { icon: <Phone size={13} />, label: 'Phone', value: app.phone || '—', href: app.phone ? `tel:${app.phone}` : null },
              { icon: <Calendar size={13} />, label: 'Applied', value: fmtDateFull(app.createdAt) },
              { icon: <Clock size={13} />, label: 'Time', value: fmtTime(app.createdAt) },
            ].map(({ icon, label, value, href }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  {icon} {label}
                </div>
                {href ? (
                  <a href={href} style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >{value}</a>
                ) : (
                  <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{value}</div>
                )}
              </div>
            ))}
          </div>

          {(app.resumeLink || app.portfolioLink) && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {app.resumeLink && (
                <a href={app.resumeLink} target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.65rem 1rem', background: 'rgba(228,241,65,0.08)', border: '1px solid rgba(228,241,65,0.2)', borderRadius: '10px', color: '#e4f141', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(228,241,65,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(228,241,65,0.08)'}
                >
                  <FileText size={14} /> View Resume <ExternalLink size={11} />
                </a>
              )}
              {app.portfolioLink && (
                <a href={app.portfolioLink} target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.65rem 1rem', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '10px', color: '#60a5fa', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,165,250,0.08)'}
                >
                  <Link2 size={14} /> View Portfolio <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}

          {app.message && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Cover Message</div>
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontStyle: 'italic' }}>
                &ldquo;{app.message}&rdquo;
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Update Status</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['pending', 'accepted', 'rejected'].map(s => {
                const sc = STATUS[s];
                const isActive = app.status === s;
                return (
                  <motion.button key={s}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => handleStatus(s)}
                    disabled={updating}
                    style={{
                      flex: 1, padding: '0.6rem',
                      background: isActive ? sc.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? sc.border : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '10px', color: isActive ? sc.color : 'rgba(255,255,255,0.4)',
                      fontSize: '0.72rem', fontWeight: 700, cursor: updating ? 'not-allowed' : 'pointer',
                      textTransform: 'capitalize', letterSpacing: '0.05em', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    }}
                  >
                    {s === 'accepted' && <CheckCircle size={12} />}
                    {s === 'rejected' && <XCircle size={12} />}
                    {s === 'pending' && <Clock size={12} />}
                    {s}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(255,61,16,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { onDelete(app._id); onClose(); }}
            style={{
              width: '100%', padding: '0.65rem',
              background: 'rgba(255,61,16,0.06)', border: '1px solid rgba(255,61,16,0.2)',
              borderRadius: '10px', color: '#FF3D10',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.15s',
            }}
          >
            <Trash2 size={13} /> Delete Application
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ApplicationCard({ app, index, onStatusChange, onDelete, onView }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const st = STATUS[app.status] || STATUS.pending;

  const handleStatus = async (s) => {
    if (s === app.status) return;
    setUpdating(true);
    await onStatusChange(app._id, s);
    setUpdating(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.12)' }}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ height: '2px', background: `linear-gradient(90deg, ${st.color}80, transparent)` }} />
      <div style={{ padding: '1.25rem 1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
            background: `linear-gradient(135deg, ${st.color}30, ${st.color}10)`,
            border: `1px solid ${st.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 900, color: st.color,
          }}>
            {app.name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{app.name}</span>
              {app.position && (
                <span style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(167,139,250,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                  {app.position}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                <Mail size={12} /> {app.email}
              </span>
              {app.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                  <Phone size={12} /> {app.phone}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: st.bg, color: st.color, fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: `1px solid ${st.border}`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />
              {st.label}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)' }}>{fmtDate(app.createdAt)} · {fmtTime(app.createdAt)}</span>
          </div>
        </div>

        {(app.resumeLink || app.portfolioLink) && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {app.resumeLink && (
              <a href={app.resumeLink} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', background: 'rgba(228,241,65,0.08)', border: '1px solid rgba(228,241,65,0.2)', borderRadius: '8px', color: '#e4f141', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(228,241,65,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(228,241,65,0.08)'}
              >
                <FileText size={12} /> Resume <ExternalLink size={10} />
              </a>
            )}
            {app.portfolioLink && (
              <a href={app.portfolioLink} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '8px', color: '#60a5fa', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,165,250,0.08)'}
              >
                <Link2 size={12} /> Portfolio <ExternalLink size={10} />
              </a>
            )}
          </div>
        )}

        {app.message && (
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => setExpanded(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'inline-block' }}>
                <ChevronDown size={14} />
              </motion.span>
              {expanded ? 'Hide message' : 'View message'}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ marginTop: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    &ldquo;{app.message}&rdquo;
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['pending', 'accepted', 'rejected'].map(s => {
            const sc = STATUS[s];
            const isActive = app.status === s;
            return (
              <motion.button key={s}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleStatus(s)}
                disabled={updating}
                style={{
                  padding: '0.35rem 0.9rem',
                  background: isActive ? sc.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? sc.border : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px', color: isActive ? sc.color : 'rgba(255,255,255,0.4)',
                  fontSize: '0.7rem', fontWeight: 700, cursor: updating ? 'not-allowed' : 'pointer',
                  textTransform: 'capitalize', letterSpacing: '0.05em', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                {s === 'accepted' && <CheckCircle size={11} />}
                {s === 'rejected' && <XCircle size={11} />}
                {s === 'pending' && <Clock size={11} />}
                {s}
              </motion.button>
            );
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <motion.button
              whileHover={{ scale: 1.04, background: 'rgba(167,139,250,0.15)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onView(app)}
              style={{ padding: '0.35rem 0.9rem', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px', color: '#a78bfa', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}
            >
              <Eye size={11} /> View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, background: 'rgba(255,61,16,0.2)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onDelete(app._id)}
              style={{ padding: '0.35rem 0.9rem', background: 'rgba(255,61,16,0.08)', border: '1px solid rgba(255,61,16,0.2)', borderRadius: '8px', color: '#FF3D10', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}
            >
              <Trash2 size={11} /> Delete
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminHiring() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showPosDropdown, setShowPosDropdown] = useState(false);

  const fetchApplications = useCallback(async (status = 'all') => {
    setLoading(true);
    try {
      const q = status !== 'all' ? `?status=${status}` : '';
      const res = await axiosInstance.get(`/admin/hiring${q}`);
      setApplications(res.data.applications || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchApplications('all'); }, [fetchApplications]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/admin/hiring/${id}`, { status: newStatus });
      const updated = res.data.application;
      setApplications(prev => prev.map(a => a._id === id ? updated : a));
      setSelectedApp(prev => prev?._id === id ? updated : prev);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await axiosInstance.delete(`/admin/hiring/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
      setSelectedApp(prev => prev?._id === id ? null : prev);
    } catch (e) { console.error(e); }
  };

  const handleFilter = (s) => { setFilter(s); fetchApplications(s); };

  const filtered = applications
    .filter(a => {
      if (positionFilter !== 'all' && a.position !== positionFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.phone?.includes(q) ||
        a.position?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const da = new Date(a.createdAt), db = new Date(b.createdAt);
      return sortOrder === 'desc' ? db - da : da - db;
    });

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const posCounts = POSITIONS.reduce((acc, p) => {
    acc[p] = applications.filter(a => a.position === p).length;
    return acc;
  }, {});
  const topPos = Object.entries(posCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <AdminLayout>
      <AnimatePresence>
        {selectedApp && (
          <DetailModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(167,139,250,0.1) 0%, rgba(96,165,250,0.06) 100%)',
          border: '1px solid rgba(167,139,250,0.18)',
          borderRadius: '18px', padding: '1.5rem 2rem',
          position: 'relative', overflow: 'hidden', marginBottom: '1.5rem',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                  <Briefcase size={18} />
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                  Hiring Applications
                </h1>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }}
                />
                {counts.pending > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{ background: '#facc15', color: '#000', fontSize: '0.6rem', fontWeight: 900, padding: '2px 7px', borderRadius: '20px', letterSpacing: '0.05em' }}
                  >
                    {counts.pending} NEW
                  </motion.span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                Talent Pipeline · {counts.all} total · {counts.pending} pending review
                {topPos && topPos[1] > 0 ? ` · Top: ${topPos[0]}` : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => exportCSV(filtered)}
                disabled={filtered.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0.6rem 1.2rem', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, cursor: filtered.length === 0 ? 'not-allowed' : 'pointer', opacity: filtered.length === 0 ? 0.5 : 1 }}
              >
                <Download size={14} /> Export CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => fetchApplications(filter)}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </motion.button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <StatCard icon={<Users size={18} />} label="Total" value={counts.all} color="#a78bfa" delay={0} />
          <StatCard icon={<Clock size={18} />} label="Pending" value={counts.pending} color="#facc15" delay={0.06} />
          <StatCard icon={<CheckCircle size={18} />} label="Accepted" value={counts.accepted} color="#4ade80" delay={0.12} />
          <StatCard icon={<XCircle size={18} />} label="Rejected" value={counts.rejected} color="#FF3D10" delay={0.18} />
          {topPos && topPos[1] > 0 && (
            <StatCard icon={<TrendingUp size={18} />} label="Top Role" value={topPos[0].split(' ')[0]} color="#60a5fa" delay={0.24} />
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search name, email, phone, role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = '#a78bfa'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {sortOrder === 'desc' ? <SortDesc size={14} /> : <SortAsc size={14} />}
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </motion.button>

          <div style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setShowPosDropdown(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: positionFilter !== 'all' ? '#a78bfa' : 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Filter size={14} />
              {positionFilter === 'all' ? 'All Roles' : positionFilter}
              <ChevronDown size={12} style={{ transform: showPosDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </motion.button>
            <AnimatePresence>
              {showPosDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
                    background: 'linear-gradient(180deg, #141414 0%, #0c0c0c 100%)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                    padding: '6px', minWidth: '160px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                  }}
                >
                  <button
                    onClick={() => { setPositionFilter('all'); setShowPosDropdown(false); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: positionFilter === 'all' ? 'rgba(167,139,250,0.15)' : 'transparent', border: 'none', borderRadius: '8px', color: positionFilter === 'all' ? '#a78bfa' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                  >All Roles</button>
                  {POSITIONS.map(pos => (
                    <button
                      key={pos}
                      onClick={() => { setPositionFilter(pos); setShowPosDropdown(false); }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', background: positionFilter === pos ? 'rgba(167,139,250,0.15)' : 'transparent', border: 'none', borderRadius: '8px', color: positionFilter === pos ? '#a78bfa' : 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                    >{pos}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {[
            { key: 'all',      label: `All (${counts.all})`,      color: '#a78bfa' },
            { key: 'pending',  label: `Pending (${counts.pending})`,  color: '#facc15' },
            { key: 'accepted', label: `Accepted (${counts.accepted})`, color: '#4ade80' },
            { key: 'rejected', label: `Rejected (${counts.rejected})`, color: '#FF3D10' },
          ].map(({ key, label, color }) => {
            const active = filter === key;
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleFilter(key)}
                style={{
                  padding: '0.45rem 0.9rem',
                  background: active ? `${color}15` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '20px',
                  color: active ? color : 'rgba(255,255,255,0.5)',
                  fontSize: '0.75rem', fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.02em',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block', marginRight: '6px', opacity: active ? 1 : 0.4 }} />
                {label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div key={i}
                animate={{ opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                style={{ height: '130px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            ))}
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '5rem 2rem', textAlign: 'center' }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >💼</motion.div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
              {search || positionFilter !== 'all' ? 'No results found' : 'No applications yet'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
              {search || positionFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Applications from the About page will appear here'}
            </div>
            {(search || positionFilter !== 'all') && (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => { setSearch(''); setPositionFilter('all'); }}
                style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Clear filters
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div key={filter + search + positionFilter + sortOrder}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <AnimatePresence>
              {filtered.map((app, i) => (
                <ApplicationCard
                  key={app._id}
                  app={app}
                  index={i}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onView={setSelectedApp}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AdminLayout>
  );
}
