// js/events.js
import { DOM } from './dom.js';
import { state } from './state.js';
import { handleLogin, handleRegister, handleLogout } from './auth.js';
import { changePage } from './router.js';
import { hideModal } from './ui.js';
import { saveUserInterests } from './pages/dashboard.js';
import { showAddDestinationForm, saveDestination } from './pages/admin.js';
import { renderRoutePlannerPage } from './pages/routePlanner.js';
import { showNextTestimonial, showPrevTestimonial } from './pages/testimonials.js';

export function setupEventListeners() {
    // Auth
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
    
    DOM.loginForm.addEventListener('submit', (e) => { e.preventDefault(); handleLogin(); });
    DOM.registerForm.addEventListener('submit', (e) => { e.preventDefault(); handleRegister(); });
    DOM.logoutBtn.addEventListener('click', handleLogout);

    // Navegación
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => changePage(e.currentTarget.dataset.page));
    });

    // Modales
    DOM.closeInterestModal.addEventListener('click', () => hideModal(DOM.interestModal));
    DOM.skipInterestBtn.addEventListener('click', () => hideModal(DOM.interestModal));
    DOM.saveInterestBtn.addEventListener('click', saveUserInterests);
    DOM.categoryOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.category-option');
        if (option) option.classList.toggle('selected');
    });

    DOM.closeDestinationModal.addEventListener('click', () => hideModal(DOM.destinationModal));
    DOM.closeDestinationFormModal.addEventListener('click', () => hideModal(DOM.destinationFormModal));
    DOM.cancelDestinationForm.addEventListener('click', () => hideModal(DOM.destinationFormModal));

    // Admin
    DOM.addDestinationBtn.addEventListener('click', showAddDestinationForm);
    DOM.saveDestinationForm.addEventListener('click', saveDestination);

    // Planificador de Rutas
    DOM.routeQuestionsContainer.addEventListener('click', function(e) {
        const button = e.target.closest('button.btn');
        if (!button) return;
        const id = parseInt(button.dataset.id);
        const type = button.dataset.type;
        const value = button.dataset.value === 'true';
        if (!state.routePreferences[id]) state.routePreferences[id] = {};
        state.routePreferences[id][type] = value;
        localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));
        renderRoutePlannerPage();
    });

    // Testimonios
    document.querySelector('.slider-prev').addEventListener('click', showPrevTestimonial);
    document.querySelector('.slider-next').addEventListener('click', showNextTestimonial);
}