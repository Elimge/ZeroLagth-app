// js/ui.js
import { DOM } from './dom.js';
import { state } from './state.js';
import { loadDashboardData, showInterestModal } from './pages/dashboard.js';

export function showAppUI() {
    DOM.authSection.style.display = 'none';
    DOM.appHeader.style.display = 'block';
    DOM.appSidebar.style.display = 'block';
    DOM.appContent.style.display = 'block';
    if (DOM.appAll) DOM.appAll.style.display = 'flex';
    
    DOM.userNameDisplay.textContent = state.user.name;
    
    if (state.isAdmin) {
        DOM.adminMenuItem.style.display = 'block';
    }
    
    const hasSetInterests = localStorage.getItem('userInterests');
    if (!hasSetInterests) {
        showInterestModal();
    } else {
        state.userInterests = JSON.parse(hasSetInterests);
        loadDashboardData();
    }
}

export function showAuthUI() {
    DOM.authSection.style.display = 'flex';
    DOM.appHeader.style.display = 'none';
    DOM.appSidebar.style.display = 'none';
    DOM.appContent.style.display = 'none';
    if (DOM.appAll) DOM.appAll.style.display = 'none';
}

export function showLoader() {
    DOM.loader.classList.add('show');
}

export function hideLoader() {
    DOM.loader.classList.remove('show');
}

export function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

export function showError(input, errorId) {
    input.style.borderColor = '#dc3545';
    document.getElementById(errorId).style.display = 'block';
    
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        document.getElementById(errorId).style.display = 'none';
    }, { once: true });
}

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function getCategoryLabel(category) {
    const categories = {
        'gastronomico': 'Gastronómico',
        'cultural': 'Cultural',
        'educativo': 'Educativo',
        'recreativo': 'Recreativo',
        'historico': 'Histórico',
        'natural': 'Natural'
    };
    return categories[category] || category;
}