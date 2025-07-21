// js/pages/favorites.js
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader } from '../ui.js';
import { createDestinationCard } from './dashboard.js';

export function loadFavorites() {
    showLoader();
    setTimeout(() => {
        DOM.favoritesGrid.innerHTML = '';
        if (state.favorites.length === 0) {
            DOM.favoritesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 30px;">No tienes destinos favoritos.</p>';
        } else {
            state.destinations.forEach(destination => {
                if (state.favorites.includes(destination.id)) {
                    DOM.favoritesGrid.appendChild(createDestinationCard(destination));
                }
            });
        }
        hideLoader();
    }, 500);
}