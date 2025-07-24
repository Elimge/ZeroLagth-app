/**
 * @file events.js
 * @description Centralizes all event listener setups for the application.
 * This module connects user interactions (clicks, submits, etc.) to their
 * corresponding handler functions defined in other modules.
 */

// Import dependencies.
import { DOM } from './dom.js';
import { handleLogin, handleRegister, handleLogout } from './auth.js';
import { changePage } from './router.js';
import { hideModal } from './ui.js';
import { saveUserInterests } from './pages/dashboard.js';
import { showAddDestinationForm, saveDestination } from './pages/admin.js';
import { showNextTestimonial, showPrevTestimonial } from './pages/testimonials.js';

/**
 * Sets up all the global event listeners for the application.
 * This function should be called once when the application initializes.
 * @function setupEventListeners
 */
export function setupEventListeners() {
    // --- Authentication Events ---
    // Handles switching between login and register tabs.
    DOM.loginTab.addEventListener('click', () => { 
        DOM.loginTab.classList.add('active');
        DOM.registerTab.classList.remove('active');
        DOM.loginForm.classList.add('active');
        DOM.registerForm.classList.remove('active'); 
    });
    
    DOM.registerTab.addEventListener('click', () => {
        DOM.registerTab.classList.add('active');
        DOM.loginTab.classList.remove('active');
        DOM.registerForm.classList.add('active');
        DOM.loginForm.classList.remove('active');
    });
    
    // Handles form submissions for login and registration.
    DOM.loginForm.addEventListener('submit', (e) => { e.preventDefault(); handleLogin(); });
    DOM.registerForm.addEventListener('submit', (e) => { e.preventDefault(); handleRegister(); });
    DOM.logoutBtn.addEventListener('click', handleLogout);

    // --- Navigation Events ---
    // Handles page navigation via sidebar links.
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => changePage(e.currentTarget.dataset.page));
    });

    // --- Modal Events ---
    // General modal close buttons.
    DOM.closeInterestModal.addEventListener('click', () => hideModal(DOM.interestModal));
    DOM.closeDestinationModal.addEventListener('click', () => hideModal(DOM.destinationModal));
    DOM.closeDestinationFormModal.addEventListener('click', () => hideModal(DOM.destinationFormModal));
    DOM.cancelDestinationForm.addEventListener('click', () => hideModal(DOM.destinationFormModal));
    
    // Interest Modal specific events.
    DOM.skipInterestBtn.addEventListener('click', () => {
        // Hide modal and load default dashboard data if user skips.
        hideModal(DOM.interestModal);
        loadDashboardData();
    });
    DOM.saveInterestBtn.addEventListener('click', saveUserInterests);
    
    // Toggles the 'selected' class on category options when clicked.
    DOM.categoryOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.category-option');
        if (option) {
            option.classList.toggle('selected');
        }
    });

    // --- Admin Page Events ---
    // Shows the form to add a new destination.
    DOM.addDestinationBtn.addEventListener('click', showAddDestinationForm);
    // Saves a new or edited destination.
    DOM.saveDestinationForm.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        saveDestination();
    });

    // --- Testimonials Page Events ---
    // Handles the navigation for the testimonials slider.
    document.querySelector('.slider-prev').addEventListener('click', showPrevTestimonial);
    document.querySelector('.slider-next').addEventListener('click', showNextTestimonial);
}