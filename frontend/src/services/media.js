/**
 * media.js — Image URL helper
 *
 * Development:  images are served from http://localhost:5000/uploads/...
 * Production:   images are Cloudinary URLs (https://res.cloudinary.com/...)
 *
 * This helper handles both cases transparently.
 * Set REACT_APP_MEDIA_URL in .env for production (your Render backend URL).
 */

const MEDIA_BASE = process.env.REACT_APP_MEDIA_URL || 'http://localhost:5000';

/**
 * Returns a fully-qualified image URL.
 * - Cloudinary URLs (start with http) → returned as-is
 * - Local paths (start with /)        → prefixed with MEDIA_BASE
 * - Null / undefined                  → returns null
 */
export const mediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;   // Cloudinary or any absolute URL
  return `${MEDIA_BASE}${path}`;              // Local /uploads/... path
};
