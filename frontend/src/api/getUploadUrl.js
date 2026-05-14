/**
 * Resolves a backend upload path to a full URL that works on both:
 * - localhost (via Vite proxy, backend on port 5000)
 * - LAN IP access (backend on same host, port 5000)
 *
 * @param {string|null} path - e.g. "/uploads/1234567890.jpg"
 * @returns {string|null} Full URL or null
 */
export function getUploadUrl(path) {
  if (!path) return null;
  // Already a full URL (http/https) or data URI — return as-is
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // Build backend origin dynamically
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const backendOrigin = `http://${hostname}:5000`;
  return `${backendOrigin}${path}`;
}
