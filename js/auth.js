/**
 * @file auth.js
 * @description Manages user authentication, including login, registration, logout,
 * and session state persistence using localStorage.
 */

// Import dependencies from other modules.
import { state } from './state.js';
import { DOM } from './dom.js';
import { showAppUI, showAuthUI, showLoader, hideLoader, showError, validateEmail } from './ui.js';
import { loadUserData } from './main.js';

/**
 * Checks the user's authentication state by looking for a token and user data in localStorage.
 * If authentication details are found, it updates the application state and displays the main app UI.
 * Otherwise, it displays the authentication (login/register) UI.
 * This function is typically called on application startup.
 * @function checkAuthState
 */
export function checkAuthState() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        // If a token and user data exist, the user is considered logged in.
        state.isLoggedIn = true;
        state.user = JSON.parse(userData);
        state.isAdmin = state.user.role === 'admin';
        showAppUI();
    } else {
        // Otherwise, show the login/register screen.
        showAuthUI();
    }
}

/**
 * Handles a successful login or registration.
 * It updates the global state, stores session data in localStorage,
 * and triggers the main application UI and data loading process.
 * @param {Object} user - The user object containing details like id, name, email, and role.
 * @private
 */
function loginSuccess(user) {
    // Update the global state with user information.
    state.isLoggedIn = true;
    state.user = user;
    state.isAdmin = user.role === 'admin';
    
    // Persist session by storing a mock token and user data in localStorage.
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(user));
    
    // Display the main application interface.
    showAppUI();
    // Load user-specific data (interests, favorites).
    loadUserData();
    hideLoader();
}

/**
 * Processes the login form submission.
 * It validates user input and simulates an API call to authenticate the user.
 * On success, it calls loginSuccess; on failure, it shows an alert.
 * @function handleLogin
 */
export function handleLogin() {
    const email = DOM.loginEmail.value.trim();
    const password = DOM.loginPassword.value.trim();
    
    // Validate inputs before proceeding.
    if (!validateEmail(email)) {
        showError(DOM.loginEmail, 'loginEmailError');
        return;
    }
    if (password.length < 6) {
        showError(DOM.loginPassword, 'loginPasswordError');
        return;
    }
    
    showLoader();
    
    // Simulate a network request with a timeout.
    setTimeout(() => {
        // Use hardcoded credentials for demo purposes.
        if (email === 'admin@example.com' && password === 'admin123') {
            loginSuccess({ id: 1, name: 'Administrador', email: 'admin@example.com', role: 'admin' });
        } else if (email === 'user@example.com' && password === 'user123') {
            loginSuccess({ id: 2, name: 'Usuario Demo', email: 'user@example.com', role: 'user' });
        } else {
            alert('Incorrect credentials. Please try again.');
            hideLoader();
        }
    }, 1000);
}

/**
 * Processes the registration form submission.
 * It validates user input and simulates an API call to create a new user account.
 * On success, it automatically logs the new user in by calling loginSuccess.
 * @function handleRegister
 */
export function handleRegister() {
    const name = DOM.registerName.value.trim();
    const email = DOM.registerEmail.value.trim();
    const password = DOM.registerPassword.value.trim();
    const confirmPassword = DOM.confirmPassword.value.trim();
    
    // Perform validation on all registration fields.
    let isValid = true;
    if (name === '') {
        showError(DOM.registerName, 'registerNameError');
        isValid = false;
    }
    if (!validateEmail(email)) {
        showError(DOM.registerEmail, 'registerEmailError');
        isValid = false;
    }
    if (password.length < 6) {
        showError(DOM.registerPassword, 'registerPasswordError');
        isValid = false;
    }
    if (password !== confirmPassword) {
        showError(DOM.confirmPassword, 'confirmPasswordError');
        isValid = false;
    }
    
    if (!isValid) return;
    
    showLoader();
    
    // Simulate a network request for registration.
    setTimeout(() => {
        // On successful registration, log the user in with the new account details.
        loginSuccess({ id: Date.now(), name, email, role: 'user' });
        hideLoader();
    }, 1000);
}

/**
 * Logs the user out.
 * It clears all session-related data from the global state and localStorage,
 * then displays the authentication UI.
 * @function handleLogout
 */
export function handleLogout() {
    // Reset global state variables.
    state.isLoggedIn = false;
    state.user = null;
    state.isAdmin = false;
    
    // Clear all persistent data from localStorage.
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userInterests');
    localStorage.removeItem('userFavorites');
    localStorage.removeItem('routePreferences');
    
    // Switch to the authentication view.
    showAuthUI();
}