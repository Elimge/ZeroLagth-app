/**
 * @file routePlanner.js
 * @description Manages all functionality for the "Build Your Route" page.
 * This includes rendering user's favorite destinations for classification,
 * handling the logic for setting urgency/importance, managing modals for
 * pros and cons, scheduling browser notifications, and displaying the sorted route.
 */

// Import dependencies.
import { showLoader, hideLoader, showModal, hideModal } from '../ui.js';
import { state } from '../state.js';
import { DOM } from '../dom.js';

/**
 * The ID of the destination currently being processed in the modals (pros/cons, visit confirm).
 * @type {number|null}
 * @private
 */
let currentDestinationId = null;

/**
 * Schedules a native browser notification to remind the user about an event.
 * The notification is scheduled to appear one hour before the destination's `eventDate`.
 * It first requests notification permission if not already granted.
 * @param {number} destinationId - The ID of the destination for the notification.
 * @private
 */
function scheduleEventNotification(destinationId) {
    // Request permission if it hasn't been granted or denied yet.
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
        return;
    }

    const destination = state.destinations.find(d => d.id === destinationId);
    if (!destination || !destination.eventDate) return;

    const eventTime = new Date(destination.eventDate).getTime();
    const now = new Date().getTime();
    const oneHourInMs = 60 * 60 * 1000;
    const notificationTime = eventTime - oneHourInMs; // 1 hour before the event.

    // Only schedule notifications for future events.
    if (notificationTime > now) {
        const timeUntilNotification = notificationTime - now;

        // Ensure the preference object exists.
        if (!state.routePreferences[destinationId]) {
            state.routePreferences[destinationId] = {};
        }

        // Clear any previously scheduled notification for this destination to avoid duplicates.
        if (state.routePreferences[destinationId].notificationTimeout) {
            clearTimeout(state.routePreferences[destinationId].notificationTimeout);
        }

        // Schedule the new notification.
        const timeoutId = setTimeout(() => {
            const notification = new Notification(`Time to visit ${destination.name}!`, {
                body: 'Click here for details.',
                icon: destination.imageUrl || '/js/logo.png', // Fallback icon.
                badge: '/js/logo.png',
                requireInteraction: true // Keeps the notification visible until interacted with.
            });

            // Set up the action to perform when the notification is clicked.
            notification.onclick = () => {
                window.focus(); // Bring the browser window to the front.
                currentDestinationId = destinationId;
                showVisitConfirmModal();
            };
        }, timeUntilNotification);

        // Store the timeout ID so it can be cancelled later if needed.
        state.routePreferences[destinationId].notificationTimeout = timeoutId;
        localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));
    }
}

/**
 * Displays the visit confirmation modal, typically after a user clicks a notification.
 * It shows the destination details along with the pros and cons the user previously entered.
 * @private
 */
function showVisitConfirmModal() {
    if (!DOM.visitConfirmModal || currentDestinationId === null) return;

    const destination = state.destinations.find(d => d.id === currentDestinationId);
    const prefs = state.routePreferences[currentDestinationId];

    if (!destination || !prefs) return;

    // Build the HTML content for the modal body.
    const htmlContent = `
        <div style="text-align: center;">
            <h3>Confirm Visit to ${destination.name}</h3>
            <div style="width: 100%; height: 200px; background-image: url('${destination.imageUrl}'); background-size: cover; border-radius: 10px; margin: 1em 0;"></div>
            <p>${destination.description}</p>
            <table style="width: 100%; margin: 1em 0; text-align: center;">
                <tr><th>PROS (Why you wanted to go)</th><th>CONS (Why you didn't want to miss it)</th></tr>
                <tr><td>${prefs.pros || 'Not specified'}</td><td>${prefs.cons || 'Not specified'}</td></tr>
            </table>
        </div>
    `;

    DOM.prosConsList.innerHTML = htmlContent;
    showModal(DOM.visitConfirmModal);
}

/**
 * Main function to render the entire "Build Your Route" page.
 * It clears previous content and dynamically creates classification cards for each favorite destination.
 * @function renderRoutePlannerPage
 */
export function renderRoutePlannerPage() {
    showLoader();
    setupModalListeners(); // Ensure modal event listeners are active.

    DOM.routeQuestionsContainer.innerHTML = '';
    DOM.sortedRouteContainer.innerHTML = '';

    if (state.favorites.length === 0) {
        DOM.routeQuestionsContainer.innerHTML = `<p>Add places to your favorites from the Dashboard to start building your route!</p>`;
        hideLoader();
        return;
    }

    // Create a classification card for each favorite destination.
    state.favorites.forEach(favId => {
        const destination = state.destinations.find(d => d.id === favId);
        if (!destination) return;

        const prefs = state.routePreferences[favId] || {};
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.dataset.destinationId = favId;
        const eventDate = destination.eventDate ? new Date(destination.eventDate) : null;
        const formattedDate = eventDate ? eventDate.toLocaleDateString('es-CO', { /* formatting options */ }) : 'No date set';

        card.innerHTML = `
            <div class="card-content">
                <h3 class="card-title">${destination.name}</h3>
                <p class="event-date"><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                    <div>
                        <strong>Is it Urgent?</strong>
                        <div class="action-buttons" style="margin-top: 5px;">
                            <button class="btn btn-sm ${prefs.urgent === true ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="urgent" data-value="true">Yes</button>
                            <button class="btn btn-sm ${prefs.urgent === false ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="urgent" data-value="false">No</button>
                        </div>
                    </div>
                    <div>
                        <strong>Is it Important?</strong>
                        <div class="action-buttons" style="margin-top: 5px;">
                            <button class="btn btn-sm ${prefs.important === true ? 'btn-primary' : 'btn-outline'}" data-id="${favId}" data-type="important" data-value="true">Yes</button>
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

/**
 * Sets up all event listeners for the modals and buttons on this page.
 * This includes listeners for closing modals, saving pros/cons, and classifying destinations.
 * @private
 */
function setupModalListeners() {
    // --- Modal Close Buttons ---
    DOM.closeProsModal.onclick = () => { hideModal(DOM.prosModal); currentDestinationId = null; };
    DOM.closeConsModal.onclick = () => { hideModal(DOM.consModal); currentDestinationId = null; };
    DOM.closeVisitConfirmModal.onclick = () => { hideModal(DOM.visitConfirmModal); currentDestinationId = null; };

    // --- Classification Button Clicks ---
    DOM.routeQuestionsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-type]');
        if (!button) return;

        const id = parseInt(button.dataset.id);
        const type = button.dataset.type;
        const value = button.dataset.value === 'true';

        if (!state.routePreferences[id]) state.routePreferences[id] = {};
        state.routePreferences[id][type] = value;

        // Update button UI to reflect the selection.
        button.parentElement.querySelectorAll('button').forEach(btn => btn.classList.remove('btn-primary', 'btn-outline'));
        button.parentElement.querySelector(`button[data-value="true"]`).classList.add(value ? 'btn-primary' : 'btn-outline');
        button.parentElement.querySelector(`button[data-value="false"]`).classList.add(!value ? 'btn-primary' : 'btn-outline');

        const prefs = state.routePreferences[id];
        // If both questions are answered, start the pros/cons flow.
        if (typeof prefs.urgent !== 'undefined' && typeof prefs.important !== 'undefined') {
            currentDestinationId = id;
            DOM.prosText.value = ''; // Clear textarea.
            showModal(DOM.prosModal); // Show "Pros" modal.
        }
    });

    // --- Pros and Cons Modal Save Buttons ---
    DOM.saveProsBtn.onclick = (e) => {
        e.preventDefault();
        const prosText = DOM.prosText.value.trim();
        if (!prosText) { alert('Please enter at least one benefit.'); return; }
        state.routePreferences[currentDestinationId].pros = prosText;
        hideModal(DOM.prosModal);
        DOM.consText.value = ''; // Clear cons textarea.
        setTimeout(() => showModal(DOM.consModal), 100); // Show "Cons" modal.
    };

    DOM.saveConsBtn.onclick = (e) => {
        e.preventDefault();
        const consText = DOM.consText.value.trim();
        if (!consText) { alert('Please enter at least one drawback.'); return; }
        state.routePreferences[currentDestinationId].cons = consText;
        localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));
        hideModal(DOM.consModal);
        alert('Information saved successfully!');
        
        // Schedule notification if the destination has an event date.
        const destination = state.destinations.find(d => d.id === currentDestinationId);
        if (destination && destination.eventDate) {
            scheduleEventNotification(currentDestinationId);
        }
        currentDestinationId = null;
    };

    // --- Visit Confirmation Modal Buttons ---
    DOM.yesVisitBtn.onclick = () => {
        hideModal(DOM.visitConfirmModal);
        alert(`Visit to ${state.destinations.find(d => d.id === currentDestinationId)?.name} confirmed!`);
        currentDestinationId = null;
    };

    DOM.noVisitBtn.onclick = () => {
        if (currentDestinationId === null) return;
        const destination = state.destinations.find(d => d.id === currentDestinationId);
        // Cancel scheduled notification.
        if (state.routePreferences[currentDestinationId]?.notificationTimeout) {
            clearTimeout(state.routePreferences[currentDestinationId].notificationTimeout);
        }
        // Remove from favorites and preferences.
        state.favorites = state.favorites.filter(id => id !== currentDestinationId);
        delete state.routePreferences[currentDestinationId];
        localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
        localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));
        
        renderRoutePlannerPage();
        hideModal(DOM.visitConfirmModal);
        alert(`Visit to ${destination?.name} has been cancelled.`);
        currentDestinationId = null;
    };
}

/**
 * Displays the sorted route at the bottom of the page based on user classifications.
 * It groups the favorite destinations into four Eisenhower Matrix categories.
 * @private
 */
function displaySortedRoute() {
    DOM.sortedRouteContainer.innerHTML = '';
    const categories = { 'IU': [], 'INU': [], 'NIU': [], 'NINU': [] };

    state.favorites.forEach(favId => {
        const dest = state.destinations.find(d => d.id === favId);
        const prefs = state.routePreferences[favId];
        // Only include destinations that have been fully classified.
        if (!dest || !prefs || typeof prefs.important === 'undefined' || typeof prefs.urgent === 'undefined') return;

        if (prefs.important && prefs.urgent) categories.IU.push(dest);
        else if (prefs.important && !prefs.urgent) categories.INU.push(dest);
        else if (!prefs.important && prefs.urgent) categories.NIU.push(dest);
        else categories.NINU.push(dest);
    });

    if (Object.values(categories).every(arr => arr.length === 0)) return;

    let routeHTML = `<div class="sorted-route-panel"><h3><i class="fas fa-route"></i> Your Suggested Route</h3><ol class="sorted-route-list">`;
    const sectionDetails = {
        IU: { title: 'Do It Now! (Important & Urgent)', emoji: '🔥' },
        INU: { title: 'Plan (Important, Not Urgent)', emoji: '🗓️' },
        NIU: { title: 'Delegate or Do It Quick (Not Important, Urgent)', emoji: '⚡' },
        NINU: { title: 'Consider Omitting (Not Important, Not Urgent)', emoji: '🗑️' }
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