/**
 * @file main.js
 * @description The main entry point for the application.
 * This script orchestrates the initialization process by checking the user's
 * authentication state, setting up event listeners, and loading initial user data.
 */

// Import dependencies.
import { state } from './state.js';
import { checkAuthState } from './auth.js';
import { setupEventListeners } from './events.js';
import { loadDashboardData } from './pages/dashboard.js';

/**
 * Loads user-specific data from localStorage into the global state.
 * This function is called after a user is confirmed to be logged in,
 * ensuring that their preferences (interests, favorites, etc.) are available
 * throughout the application.
 * @function loadUserData
 */
export function loadUserData() {
    // Load user's selected interests.
    const interests = localStorage.getItem('userInterests');
    if (interests) {
        state.userInterests = JSON.parse(interests);
    }
    
    // Load user's favorite destinations.
    const favorites = localStorage.getItem('userFavorites');
    if (favorites) {
        state.favorites = JSON.parse(favorites);
    }
    
    // Load user's route planning preferences.
    const routePrefs = localStorage.getItem('routePreferences');
    if (routePrefs) {
        state.routePreferences = JSON.parse(routePrefs);
    }

    // After loading user data, fetch the main application data for the dashboard.
    loadDashboardData();
}

/**
 * The main initialization function for the entire application.
 * It sets everything in motion.
 * @private
 */
function init() {
    // 1. Check if the user is already logged in from a previous session.
    checkAuthState();
    
    // 2. Set up all the application's event listeners.
    setupEventListeners();
    
    // 3. If the user is logged in, load their personalized data.
    if (state.isLoggedIn) {
        loadUserData();
    }
}

// --- Application Start ---
// Add an event listener to run the init function as soon as the DOM is fully loaded.
// This ensures that all HTML elements are available before any scripts try to access them.
document.addEventListener('DOMContentLoaded', init);