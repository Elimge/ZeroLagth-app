/**
 * @file router.js
 * @description Manages client-side routing for the Single Page Application (SPA).
 * It controls which page component is displayed based on user interaction,
 * and triggers the necessary data loading functions for each page.
 */

// Import dependencies.
import { DOM } from './dom.js';
import { state } from './state.js';
import { loadDashboardData } from './pages/dashboard.js';
import { loadFavorites } from './pages/favorites.js';
import { renderRoutePlannerPage } from './pages/routePlanner.js';
import { loadTestimonials } from './pages/testimonials.js';
import { loadAdminData } from './pages/admin.js';

/**
 * Changes the currently displayed page in the application.
 * It hides all pages, shows the target page, updates the active state of sidebar links,
 * and calls the appropriate function to load data for the new page.
 *
 * @param {string} page - The identifier of the page to navigate to (e.g., 'dashboard', 'favorites').
 * @function changePage
 */
export function changePage(page) {
    // 1. Hide all page elements to clear the view.
    // This filters the DOM object for elements that are pages (based on their ID ending with 'Page').
    Object.values(DOM)
        .filter(el => el && el.id && el.id.endsWith('Page'))
        .forEach(el => el.style.display = 'none');

    // 2. Remove the 'active' class from all sidebar links for a clean state.
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    
    // 3. Update the global state with the new current page.
    state.currentPage = page;
    
    // 4. Show the target page element and set its corresponding sidebar link as active.
    const link = document.querySelector(`.sidebar-link[data-page="${page}"]`);
    if (link) {
        link.classList.add('active');
    }
    
    const pageElement = DOM[`${page}Page`];
    if (pageElement) {
        pageElement.style.display = 'block';
    }

    // 5. Load the necessary data for the newly displayed page.
    // This is a key part of the routing logic, ensuring each view has the data it needs.
    switch (page) {
        case 'dashboard':
            // Load dashboard data only if it hasn't been loaded before to optimize.
            if (!state.destinations.length) {
                loadDashboardData();
            }
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'routePlanner':
            renderRoutePlannerPage();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
        case 'admin':
            // Protected route: only load admin data if the user is an admin.
            if (state.isAdmin) {
                loadAdminData();
            } else {
                // If not an admin, redirect to the dashboard as a fallback.
                changePage('dashboard'); 
            }
            break;
    }
}