/**
 * @file ui.js
 * @description This module contains utility functions for controlling the application's user interface.
 * It handles global UI changes like showing/hiding main sections, modals, loaders,
 * and displaying validation errors.
 */

// Import dependencies.
import { DOM } from './dom.js';
import { state } from './state.js';
import { loadDashboardData, showInterestModal } from './pages/dashboard.js';

/**
 * Displays the main application user interface and hides the authentication screen.
 * This function is called after a successful login or if a valid session is found.
 * It also checks if the user has set their interests and prompts them if they haven't.
 * @function showAppUI
 */
export function showAppUI() {
    // Hide authentication UI and show the main app layout.
    DOM.authSection.style.display = 'none';
    DOM.appHeader.style.display = 'block';
    DOM.appSidebar.style.display = 'block';
    DOM.appContent.style.display = 'block';
    if (DOM.appAll) DOM.appAll.style.display = 'flex';
    
    // Set the user's name in the sidebar.
    DOM.userNameDisplay.textContent = state.user.name;
    
    // Display the admin menu item only if the user is an admin.
    if (state.isAdmin) {
        DOM.adminMenuItem.style.display = 'block';
    }
    
    // On first login, prompt the user to select their interests.
    const hasSetInterests = localStorage.getItem('userInterests');
    if (!hasSetInterests) {
        showInterestModal();
    } else {
        // If interests are already set, load them into the state.
        state.userInterests = JSON.parse(hasSetInterests);
        loadDashboardData();
    }
}

/**
 * Displays the authentication user interface (login/register) and hides the main application.
 * This function is called on startup if the user is not logged in, or after a logout.
 * @function showAuthUI
 */
export function showAuthUI() {
    // Show authentication UI and hide the main app layout.
    DOM.authSection.style.display = 'flex';
    DOM.appHeader.style.display = 'none';
    DOM.appSidebar.style.display = 'none';
    DOM.appContent.style.display = 'none';
    if (DOM.appAll) DOM.appAll.style.display = 'none';
}

/**
 * Shows the global loading spinner overlay.
 * Useful for providing feedback during asynchronous operations like API calls.
 * @function showLoader
 */
export function showLoader() {
    DOM.loader.classList.add('show');
}

/**
 * Hides the global loading spinner overlay.
 * @function hideLoader
 */
export function hideLoader() {
    DOM.loader.classList.remove('show');
}

/**
 * Displays a modal dialog.
 * It adds the 'active' class to the modal overlay and prevents background scrolling.
 * @param {HTMLElement} modal - The modal element to be shown.
 * @function showModal
 */
export function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling of the background content.
}

/**
 * Hides a modal dialog.
 * It removes the 'active' class and restores background scrolling.
 * @param {HTMLElement} modal - The modal element to be hidden.
 * @function hideModal
 */
export function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling.
}

/**
 * Displays a validation error message for a form input.
 * It changes the input's border color to red and shows the associated error message element.
 * The error state is automatically removed once the user starts typing in the input again.
 * @param {HTMLElement} input - The input element that has a validation error.
 * @param {string} errorId - The ID of the HTML element containing the error message.
 * @function showError
 */
export function showError(input, errorId) {
    input.style.borderColor = '#dc3545'; // Red border to indicate an error.
    document.getElementById(errorId).style.display = 'block';
    
    // Add a one-time event listener to clear the error style on the next input.
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        document.getElementById(errorId).style.display = 'none';
    }, { once: true });
}

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 * @function validateEmail
 */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Converts a category key (e.g., 'gastronomico') into a user-friendly, capitalized label.
 * @param {string} category - The category key.
 * @returns {string} The display-friendly category label (e.g., 'Gastronómico').
 * @function getCategoryLabel
 */
export function getCategoryLabel(category) {
    const categories = {
        'gastronomico': 'Gastronómico',
        'cultural': 'Cultural',
        'educativo': 'Educativo',
        'recreativo': 'Recreativo',
        'historico': 'Histórico',
        'natural': 'Natural'
    };
    // Return the corresponding label or the original key if not found.
    return categories[category] || category;
}