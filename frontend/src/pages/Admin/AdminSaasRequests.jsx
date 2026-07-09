import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from './AdminLayout';
import axiosInstance from '../../api/axiosInstance';

const STATUS_COLORS = {
  pending: { bg: 'rgba(250,204,21,0.1)', color: '#facc15', border: 'rgba(250,204,21,0.3)' },
  approved: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
};

const STATUS_OPTIONS = ['pending', 'approved', 'rejected'];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

export default function AdminSaasRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/saas-requests');
      setRequests(res.data.saasRequests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch(`/saas-requests/${id}`, { status: newStatus });
      setRequests((prev) => prev.map((r) => r._id === id ? res.data.saasRequest : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadToggle = async (id, isRead) => {
    try {
      const res = await axiosInstance.patch(`/saas-requests/${id}`, { isRead: !isRead });
      setRequests((prev) => prev.map((r) => r._id === id ? res.data.saasRequest : r));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this early access request?')) return;
    try {
      await axiosInstance.delete(`/saas-requests/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
          YBEX SaaS Beta Access
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
          {requests.length} total beta access requests
        </p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}
      >
        {['all', ...STATUS_OPTIONS].map((s, i) => {
          const isActive = filterStatus === s;
          const sc = s !== 'all' ? STATUS_COLORS[s] : null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '0.4rem 1.1rem',
                background: isActive ? (sc ? sc.bg : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? (sc ? sc.border : 'rgba(255,255,255,0.25)') : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px',
                color: isActive ? (sc ? sc.color : '#fff') : 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize', letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
            >
              {s}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: '100px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}
              />
            ))}
          </motion.div>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', padding: '5rem', textAlign: 'center',
              color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
            No requests found.
          </motion.div>
        ) : (
          <motion.div
            key={filterStatus}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <AnimatePresence>
              {filteredRequests.map((r, i) => {
                const sc = STATUS_COLORS[r.status] || STATUS_COLORS.pending;
                return (
                  <motion.div
                    key={r._id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    style={{
                      background: r.isRead ? 'rgba(255,255,255,0.015)' : 'rgba(228,241,65,0.025)',
                      border: `1px solid ${r.isRead ? 'rgba(255,255,255,0.06)' : 'rgba(228,241,65,0.15)'}`,
                      borderRadius: '14px', padding: '1.25rem 1.5rem',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Header metadata */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                          <span style={{
                            background: r.isRead ? 'rgba(255,255,255,0.07)' : 'rgba(228,241,65,0.15)',
                            color: r.isRead ? 'rgba(255,255,255,0.45)' : '#E4F141',
                            fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.55rem',
                            borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em',
                          }}>
                            {r.isRead ? 'READ' : 'NEW'}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.76rem' }}>
                            {formatDate(r.createdAt)}
                          </span>
                        </div>

                        {/* Email address */}
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>
                          {r.email}
                        </div>

                        {/* Phone details */}
                        {r.phone ? (
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📞</span> <span>{r.phone}</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            No phone number provided
                          </div>
                        )}
                      </div>

                      {/* Right Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Status dropdown */}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value)}
                          style={{
                            background: 'rgba(10,10,10,0.8)',
                            color: sc.color,
                            border: `1px solid ${sc.border}`,
                            borderRadius: '6px',
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt} style={{ background: '#111', color: '#fff' }}>
                              {opt.toUpperCase()}
                            </option>
                          ))}
                        </select>

                        {/* Toggle Read */}
                        <button
                          onClick={() => handleReadToggle(r._id, r.isRead)}
                          title={r.isRead ? "Mark as Unread" : "Mark as Read"}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            padding: '0.3rem 0.5rem',
                            fontSize: '0.75rem',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {r.isRead ? '✉️' : '📖'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(r._id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '6px',
                            padding: '0.3rem 0.5rem',
                            fontSize: '0.75rem',
                            color: '#f87171',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
