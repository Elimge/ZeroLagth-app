// js/pages/routePlanner.js
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader } from '../ui.js';

export function renderRoutePlannerPage() {
    showLoader();
    DOM.routeQuestionsContainer.innerHTML = '';
    DOM.sortedRouteContainer.innerHTML = '';

    if (state.favorites.length === 0) {
        DOM.routeQuestionsContainer.innerHTML = `<p>Aún no has añadido lugares a tus favoritos. ¡Ve al Dashboard y pulsa el ❤️ para empezar!</p>`;
        hideLoader();
        return;
    }

    state.favorites.forEach(favId => {
        const destination = state.destinations.find(d => d.id === favId);
        if (!destination) return;

        const prefs = state.routePreferences[favId] || {};
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <div class="card-content">
                <h3 class="card-title">${destination.name}</h3>
                <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                    <div>
                        <strong>¿Es Urgente?</strong>
                        <div class="action-buttons" style="margin-top: 5px;">
                            <button class="btn btn-sm ${prefs.urgent === true ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="urgent" data-value="true">Sí</button>
                            <button class="btn btn-sm ${prefs.urgent === false ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="urgent" data-value="false">No</button>
                        </div>
                    </div>
                    <div>
                        <strong>¿Es Importante?</strong>
                        <div class="action-buttons" style="margin-top: 5px;">
                            <button class="btn btn-sm ${prefs.important === true ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="important" data-value="true">Sí</button>
                            <button class="btn btn-sm ${prefs.important === false ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="important" data-value="false">No</button>
                        </div>
                    </div>
                </div>
            </div>`;
        DOM.routeQuestionsContainer.appendChild(card);
    });

    displaySortedRoute();
    hideLoader();
}

function displaySortedRoute() {
    DOM.sortedRouteContainer.innerHTML = '';
    const categories = { 'IU': [], 'INU': [], 'NIU': [], 'NINU': [] };

    state.favorites.forEach(favId => {
        const dest = state.destinations.find(d => d.id === favId);
        const prefs = state.routePreferences[favId];
        if (!dest || !prefs || typeof prefs.important === 'undefined' || typeof prefs.urgent === 'undefined') return;

        if (prefs.important && prefs.urgent) categories.IU.push(dest);
        else if (prefs.important && !prefs.urgent) categories.INU.push(dest);
        else if (!prefs.important && prefs.urgent) categories.NIU.push(dest);
        else categories.NINU.push(dest);
    });

    if (Object.values(categories).every(arr => arr.length === 0)) return;

    let routeHTML = `<div class="sorted-route-panel"><h3><i class="fas fa-route"></i> Tu Ruta Sugerida</h3><ol class="sorted-route-list">`;
    const sectionDetails = {
        IU: { title: '¡Hazlo Ahora! (Importante y Urgente)', emoji: '🔥' },
        INU: { title: 'Planifica (Importante, No Urgente)', emoji: '🗓️' },
        NIU: { title: 'Delega o Hazlo Rápido (No Importante, Urgente)', emoji: '⚡' },
        NINU: { title: 'Considera Omitir (No Importante, No Urgente)', emoji: '🗑️' }
    };

    ['IU', 'INU', 'NIU', 'NINU'].forEach(key => {
        if (categories[key].length > 0) {
            routeHTML += `<h4 class="route-category-title">${sectionDetails[key].emoji} ${sectionDetails[key].title}</h4>`;
            categories[key].forEach(dest => {
                routeHTML += `<li class="route-item"><span class="route-indicator indicator-${key.toLowerCase()}"></span>${dest.name} <span style="color: #888;">(${dest.location})</span></li>`;
            });
        }
    });

    routeHTML += `</ol></div>`;
    DOM.sortedRouteContainer.innerHTML = routeHTML;
}