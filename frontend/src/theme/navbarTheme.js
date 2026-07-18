
export const GLOW_THEMES = {
  '/': '#000000',           // Home: Black background / No Glow
  '/creators': '#000000',    // Creators: Black background / No Glow
  '/services': '#000000',    // Services: Black background / No Glow
  '/portfolio': '#000000',   // Portfolio: Black background / No Glow
  '/academy': '#000000',     // Academy: Black background / No Glow
  '/invoice': '#000000',     // Invoice: Black background / No Glow
  '/about': '#000000',       // About: Black background / No Glow
};

// Fallback color for unmapped pages
export const DEFAULT_GLOW = '#000000';


/**
 * Returns the correct glow color based on the current pathname
 * @param {string} pathname 
 * @returns {string} hex color
 */
export function getGlowColor(pathname) {
  // Exact match
  if (GLOW_THEMES[pathname]) {
    return GLOW_THEMES[pathname];
  }

  // Handle sub-pages (e.g., /inhouse-team should use the services theme)
  if (pathname === '/inhouse-team') {
    return GLOW_THEMES['/services'];
  }

  // Default fallback
  return DEFAULT_GLOW;
}
