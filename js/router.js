
// js/router.js
import { DOM } from './dom.js';
import { state } from './state.js';
import { loadDashboardData } from './pages/dashboard.js';
import { loadFavorites } from './pages/favorites.js';
import { renderRoutePlannerPage } from './pages/routePlanner.js';
import { loadTestimonials } from './pages/testimonials.js';
import { loadAdminData } from './pages/admin.js';

export function changePage(page) {
    // Ocultar todas las páginas
    Object.values(DOM).filter(el => el && el.id && el.id.endsWith('Page')).forEach(el => el.style.display = 'none');

    // Quitar clase activa de todos los links
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    
    state.currentPage = page;
    
    // Mostrar página seleccionada y activar link
    const link = document.querySelector(`.sidebar-link[data-page="${page}"]`);
    if (link) link.classList.add('active');
    
    const pageElement = DOM[`${page}Page`];
    if (pageElement) {
        pageElement.style.display = 'block';
    }

    // Cargar datos para la página específica
    switch (page) {
        case 'dashboard':
            if (!state.destinations.length) loadDashboardData();
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
            if (state.isAdmin) {
                loadAdminData();
            } else {
                changePage('dashboard'); // Redirigir si no es admin
            }
            break;
    }
}