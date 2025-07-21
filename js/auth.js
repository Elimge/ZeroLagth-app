// js/auth.js
import { state } from './state.js';
import { DOM } from './dom.js';
import { showAppUI, showAuthUI, showLoader, hideLoader, showError, validateEmail } from './ui.js';
import { loadUserData } from './main.js';

export function checkAuthState() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        state.isLoggedIn = true;
        state.user = JSON.parse(userData);
        state.isAdmin = state.user.role === 'admin';
        showAppUI();
    } else {
        showAuthUI();
    }
}

function loginSuccess(user) {
    state.isLoggedIn = true;
    state.user = user;
    state.isAdmin = user.role === 'admin';
    
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(user));
    
    showAppUI();
    loadUserData(); // Cargar datos después de iniciar sesión
    hideLoader();
}

export function handleLogin() {
    const email = DOM.loginEmail.value.trim();
    const password = DOM.loginPassword.value.trim();
    
    if (!validateEmail(email)) {
        showError(DOM.loginEmail, 'loginEmailError');
        return;
    }
    if (password.length < 6) {
        showError(DOM.loginPassword, 'loginPasswordError');
        return;
    }
    
    showLoader();
    
    setTimeout(() => {
        if (email === 'admin@example.com' && password === 'admin123') {
            loginSuccess({ id: 1, name: 'Administrador', email: 'admin@example.com', role: 'admin' });
        } else if (email === 'user@example.com' && password === 'user123') {
            loginSuccess({ id: 2, name: 'Usuario Demo', email: 'user@example.com', role: 'user' });
        } else {
            alert('Credenciales incorrectas. Por favor intente de nuevo.');
            hideLoader();
        }
    }, 1000);
}

export function handleRegister() {
    const name = DOM.registerName.value.trim();
    const email = DOM.registerEmail.value.trim();
    const password = DOM.registerPassword.value.trim();
    const confirmPassword = DOM.confirmPassword.value.trim();
    
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
    
    setTimeout(() => {
        loginSuccess({ id: Date.now(), name, email, role: 'user' });
        hideLoader();
    }, 1000);
}

export function handleLogout() {
    state.isLoggedIn = false;
    state.user = null;
    state.isAdmin = false;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userInterests');
    localStorage.removeItem('userFavorites');
    localStorage.removeItem('routePreferences');
    
    showAuthUI();
}
