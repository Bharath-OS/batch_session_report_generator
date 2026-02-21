/**
 * Centralized configuration for the application.
 * Values are read from environment variables for production (Vercel)
 * and use fallbacks for local development.
 */

export const ADMIN_CONFIG = {
    email: process.env.ADMIN_EMAIL || 'bcr306admin@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'bcr306adminpanel'
};

export const GOOGLE_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx2PHP3yFEtLl8HqU0LfZkXFlcQ1hwi4R8XAOVkiU9XPE-PmY6OshyKv5GMapPgg-Qe/exec';

// Form details or other non-sensitive config
export const FORM_DETAILS = {
    // formLink: process.env.NEXT_PUBLIC_FORM_LINK || '...',
};
