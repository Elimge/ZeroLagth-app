/**
 * @file state.js
 * @description Defines the central state object for the entire application.
 * This object acts as the single source of truth for all dynamic data.
 * Centralizing the state makes it easier to manage, debug, and keep the UI consistent.
 */

/**
 * The global state object for the application.
 * @property {boolean} isLoggedIn - Tracks if a user is currently logged in.
 * @property {boolean} isAdmin - Tracks if the logged-in user has administrator privileges.
 * @property {Object|null} user - Stores the user object of the logged-in user. Null if not logged in.
 * @property {string} currentPage - The identifier for the currently active page (e.g., 'dashboard').
 * @property {Array<string>} userInterests - An array of strings representing the user's selected interests (e.g., ['cultural', 'natural']).
 * @property {Array<number>} favorites - An array of destination IDs that the user has marked as favorites.
 * @property {Object} routePreferences - An object storing user-defined urgency, importance, pros, and cons for favorite destinations. The key is the destination ID.
 * @property {Array<Object>} destinations - An array of all destination objects fetched from the API.
 * @property {Array<Object>} testimonials - An array of all testimonial objects.
 * @const {Object} state
 */
export const state = {
    // Authentication and User State
    isLoggedIn: false,
    isAdmin: false,
    user: null,

    // Navigation and UI State
    currentPage: 'dashboard',

    // User-Specific Data
    userInterests: [],
    favorites: [],
    routePreferences: {}, // Example: { 1: { urgent: true, important: false, pros: "...", cons: "..." } }
    
    // Application Content Data
    destinations: [],
    testimonials: []
};