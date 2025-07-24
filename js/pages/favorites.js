/**
 * @file favorites.js
 * @description Manages the "Favorites" page functionality.
 * It is responsible for rendering the grid of destinations that the user
 * has marked as their favorites.
 */

// Import dependencies.
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader } from '../ui.js';
// We reuse createDestinationCard from the dashboard module to maintain consistency and avoid code duplication.
import { createDestinationCard } from './dashboard.js';

/**
 * Loads and displays the user's favorite destinations.
 * It filters the main destinations list based on the IDs stored in `state.favorites`
 * and renders them in a grid.
 * @function loadFavorites
 */
export function loadFavorites() {
    showLoader();
    // Use a timeout to simulate a network request and allow the loader to be visible.
    setTimeout(() => {
        // Clear any previous content from the favorites grid.
        DOM.favoritesGrid.innerHTML = '';
        
        // Check if the user has any favorites.
        if (state.favorites.length === 0) {
            // If not, display a message to the user.
            DOM.favoritesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 30px;">You have no favorite destinations yet.</p>';
        } else {
            // If there are favorites, iterate through all destinations...
            state.destinations.forEach(destination => {
                // ...and check if the current destination's ID is in the favorites array.
                if (state.favorites.includes(destination.id)) {
                    // If it is, create a card and append it to the grid.
                    DOM.favoritesGrid.appendChild(createDestinationCard(destination));
                }
            });
        }
        
        hideLoader();
    }, 500);
}