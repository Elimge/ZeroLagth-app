/**
 * @file dashboard.js
 * @description Manages all functionality for the main dashboard page.
 * This includes fetching and displaying destinations in the Eisenhower-style grid,
 * creating destination cards, and handling modals for user interests and destination details.
 */

// Import dependencies.
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader, showModal, hideModal, getCategoryLabel } from '../ui.js';
import { fetchDestinations } from '../api.js';

// --- Dashboard Logic ---

/**
 * Loads all necessary data for the dashboard.
 * It fetches the destinations from the API, stores them in the global state,
 * and then calls the function to populate the UI.
 * @async
 * @function loadDashboardData
 */
export async function loadDashboardData() {
    showLoader();
    const destinations = await fetchDestinations();
    state.destinations = destinations;
    populateEisenhowerMatrix(destinations);
    hideLoader();
}

/**
 * Populates the four quadrants of the Eisenhower-style grid on the dashboard.
 * The distribution is based on the user's selected interests.
 * 1. Your Preferences: Direct matches with user interests.
 * 2. Related: Matches with categories related to user interests.
 * 3. Others: The remaining destinations are split between the last two quadrants.
 * @param {Array<Object>} destinations - The array of all destination objects.
 * @private
 */
function populateEisenhowerMatrix(destinations) {
    // Clear any existing content in the grid containers.
    DOM.urgentImportantContainer.innerHTML = '<h3><i class="fas fa-star"></i> Your Preferences</h3>';
    DOM.notUrgentImportantContainer.innerHTML = '<h3><i class="fas fa-sitemap"></i> Related Places</h3>';
    DOM.urgentNotImportantContainer.innerHTML = '<h3><i class="fas-fa-compass"></i> You Might Like</h3>';
    DOM.notUrgentNotImportantContainer.innerHTML = '<h3><i class="fas fa-map-signs"></i> Other Places</h3>';

    // Defines relationships between categories for the "Related" quadrant.
    const relatedCategories = {
        'gastronomico': ['recreativo'],
        'cultural': ['historico', 'educativo'],
        'educativo': ['cultural', 'historico'],
        'recreativo': ['natural', 'gastronomico'],
        'historico': ['cultural', 'educativo'],
        'natural': ['recreativo']
    };
    const addedIds = new Set(); // Use a Set to prevent duplicate destinations in the grid.

    // 1. Populate "Your Preferences" (matches user interests directly).
    destinations.forEach(d => {
        if (state.userInterests.includes(d.category)) {
            DOM.urgentImportantContainer.appendChild(createDestinationCard(d));
            addedIds.add(d.id);
        }
    });

    // 2. Populate "Related Places" (matches related categories).
    destinations.forEach(d => {
        if (!addedIds.has(d.id) && state.userInterests.some(cat => (relatedCategories[cat] || []).includes(d.category))) {
            DOM.notUrgentImportantContainer.appendChild(createDestinationCard(d));
            addedIds.add(d.id);
        }
    });

    // 3. Populate the remaining two quadrants with the rest of the destinations.
    const remainingDestinations = destinations.filter(d => !addedIds.has(d.id));
    const half = Math.ceil(remainingDestinations.length / 2);
    remainingDestinations.forEach((d, index) => {
        if (index < half) {
            DOM.urgentNotImportantContainer.appendChild(createDestinationCard(d));
        } else {
            DOM.notUrgentNotImportantContainer.appendChild(createDestinationCard(d));
        }
    });
}

/**
 * Creates and returns an HTML element for a single destination card.
 * This function encapsulates the card's structure and behavior, including click events
 * for showing details and toggling favorites.
 * @param {Object} destination - The destination object to render.
 * @returns {HTMLElement} The fully constructed destination card element.
 * @function createDestinationCard
 */
export function createDestinationCard(destination) {
    const isFavorite = state.favorites.includes(destination.id);
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.id = destination.id;
    card.innerHTML = `
        <div class="card-img-container">
            <img src="${destination.imageUrl}" alt="${destination.name}" class="card-img">
        </div>
        <span class="category-tag">${getCategoryLabel(destination.category)}</span>
        <div class="card-content">
            <h3 class="card-title">${destination.name}</h3>
            <p class="card-description">${destination.description.substring(0, 100)}...</p>
        </div>
        <div class="card-footer">
            <div class="card-location"><i class="fas fa-map-marker-alt"></i><span>${destination.location}</span></div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${destination.id}"><i class="fas fa-heart"></i></button>
        </div>`;

    // Add click listener to the card itself to show details (but not on the favorite button).
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            showDestinationDetails(destination);
        }
    });

    // Add click listener to the favorite button to toggle its state.
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the card's click event from firing.
        toggleFavorite(destination.id);
        e.currentTarget.classList.toggle('active');
    });
    return card;
}

// --- Interest and Destination Modal Logic ---

/**
 * Displays the modal for selecting user interests.
 * @function showInterestModal
 */
export function showInterestModal() {
    showModal(DOM.interestModal);
}

/**
 * Saves the user's selected interests from the interest modal.
 * It updates the global state, persists the choices to localStorage,
 * and reloads the dashboard to reflect the new preferences.
 * @function saveUserInterests
 */
export function saveUserInterests() {
    const selectedInterests = [];
    document.querySelectorAll('.category-option.selected').forEach(option => {
        selectedInterests.push(option.dataset.category);
    });
    state.userInterests = selectedInterests;
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    hideModal(DOM.interestModal);
    loadDashboardData();
}

/**
 * Displays a modal with detailed information about a specific destination.
 * @param {Object} destination - The destination object to display.
 * @private
 */
function showDestinationDetails(destination) {
    const isFavorite = state.favorites.includes(destination.id);
    const eventDate = destination.eventDate ? new Date(destination.eventDate) : null;
    const formattedDate = eventDate ?
        eventDate.toLocaleDateString('es-CO', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }) : 'No date set';
    
    // Populate the modal with the destination's details.
    DOM.destinationDetails.innerHTML = `
        <div class="details-header">
            <div>
                <h2 class="details-title">${destination.name}</h2>
                <span class="details-category">${getCategoryLabel(destination.category)}</span>
            </div>
            <div class="details-actions">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${destination.id}" style="font-size: 24px;"><i class="fas fa-heart"></i></button>
            </div>
        </div>
        <img src="${destination.imageUrl}" alt="${destination.name}" class="details-img">
        <p class="details-description">${destination.description}</p>
        <div class="map-container"><p><i class="fas fa-map-marked-alt"></i> Location Map: ${destination.coordinates}</p></div>
        <div class="guides-section">
            <h3>Available Tour Guides</h3>
            <!-- Mock data for guides -->
        </div>
        <div class="schedule-section">
            <h3>Available Schedules</h3>
            <div class="schedule-slots">
                <div class="time-slot">Date: ${formattedDate}</div>
            </div>
        </div>
    `;
    
    // Add event listener to the favorite button inside the modal.
    const favoriteBtn = DOM.destinationDetails.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(destination.id);
        favoriteBtn.classList.toggle('active');
        // Sync the favorite status with the card on the dashboard.
        document.querySelectorAll(`.destination-card .favorite-btn[data-id="${destination.id}"]`).forEach(btn => {
            btn.classList.toggle('active');
        });
    });

    showModal(DOM.destinationModal);
}

/**
 * Toggles a destination's favorite status.
 * It adds or removes the destination ID from the `state.favorites` array
 * and persists the change to localStorage.
 * @param {number} destinationId - The ID of the destination to toggle.
 * @function toggleFavorite
 */
export function toggleFavorite(destinationId) {
    const index = state.favorites.indexOf(destinationId);
    if (index === -1) {
        state.favorites.push(destinationId); // Add to favorites
    } else {
        state.favorites.splice(index, 1); // Remove from favorites
    }
    localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
}