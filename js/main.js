// js/main.js
import { state } from './state.js';
import { checkAuthState } from './auth.js';
import { setupEventListeners } from './events.js';
import { loadDashboardData } from './pages/dashboard.js';

// Función para cargar datos iniciales del usuario desde localStorage
export function loadUserData() {
    const interests = localStorage.getItem('userInterests');
    if (interests) state.userInterests = JSON.parse(interests);
    
    const favorites = localStorage.getItem('userFavorites');
    if (favorites) state.favorites = JSON.parse(favorites);
    
    const routePrefs = localStorage.getItem('routePreferences');
    if (routePrefs) state.routePreferences = JSON.parse(routePrefs);

    loadDashboardData();
}

// Función de inicialización principal
function init() {
    checkAuthState();
    setupEventListeners();
    
    if (state.isLoggedIn) {
        loadUserData();
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);