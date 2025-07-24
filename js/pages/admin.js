/**
 * @file admin.js
 * @description Manages the functionality of the administrator dashboard.
 * This includes rendering the list of all destinations, handling CRUD operations
 * (Create, Read, Update, Delete), and managing the associated forms and modals.
 */

// Import dependencies.
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader, showModal, hideModal, getCategoryLabel } from '../ui.js';

/**
 * Loads and displays the data for the admin page.
 * It dynamically generates a table with all the destinations from the global state,
 * and attaches event listeners for edit and delete actions.
 * @function loadAdminData
 */
export function loadAdminData() {
    showLoader();
    // Use a timeout to simulate a network request and allow the loader to be visible.
    setTimeout(() => {
        // Clear any existing content from the table body.
        DOM.destinationsTable.innerHTML = '';
        
        // Iterate over each destination to create a table row.
        state.destinations.forEach(destination => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${destination.name}</td>
                <td>${getCategoryLabel(destination.category)}</td>
                <td>${destination.location}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" data-id="${destination.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-id="${destination.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>`;
            
            // Add event listener to the edit button to open the form modal.
            row.querySelector('.edit-btn').addEventListener('click', () => showEditDestinationForm(destination));
            
            // Add event listener to the delete button.
            row.querySelector('.delete-btn').addEventListener('click', () => {
                // Show a confirmation dialog before proceeding with deletion.
                if (confirm('Are you sure you want to delete this destination?')) {
                    deleteDestination(destination.id);
                }
            });
            
            // Append the newly created row to the table.
            DOM.destinationsTable.appendChild(row);
        });
        
        hideLoader();
    }, 500);
}

/**
 * Displays the form modal for adding a new destination.
 * It resets the form to ensure no old data is present.
 * @function showAddDestinationForm
 */
export function showAddDestinationForm() {
    DOM.formModalTitle.textContent = 'Add New Destination';
    DOM.destinationForm.reset(); // Clear all form fields.
    DOM.destinationId.value = ''; // Ensure the hidden ID field is empty for a 'create' operation.
    showModal(DOM.destinationFormModal);
}

/**
 * Displays the form modal for editing an existing destination.
 * It pre-fills the form with the data of the selected destination.
 * @param {Object} destination - The destination object to be edited.
 * @private
 */
function showEditDestinationForm(destination) {
    DOM.formModalTitle.textContent = 'Edit Destination';
    // Pre-fill the form fields with the existing destination's data.
    DOM.destinationId.value = destination.id;
    DOM.destinationName.value = destination.name;
    DOM.destinationCategory.value = destination.category;
    DOM.destinationDescription.value = destination.description;
    DOM.destinationImageUrl.value = destination.imageUrl;
    DOM.destinationLocation.value = destination.location;
    DOM.destinationCoordinates.value = destination.coordinates;
    // ... Any other form fields would be populated here.
    showModal(DOM.destinationFormModal);
}

/**
 * Saves a destination's data (either creating a new one or updating an existing one).
 * Note: The current implementation is a placeholder. The actual logic is in events.js and main.js (for older versions).
 * The modern approach would be to have the full save logic here.
 * @function saveDestination
 */
export function saveDestination() {
    // In a fully-fledged app, the logic to extract data from the form
    // and update the state would reside here.
    // For now, it just reloads the data and closes the modal.
    console.log("Save operation triggered...");
    // The actual save logic is connected in events.js.
    loadAdminData();
    hideModal(DOM.destinationFormModal);
}

/**
 * Deletes a destination from the state.
 * Note: Placeholder function. The core logic should handle state mutation.
 * @param {number} id - The ID of the destination to delete.
 * @private
 */
function deleteDestination(id) {
    // The state mutation logic would go here (e.g., state.destinations = state.destinations.filter(...)).
    // For this project, we simply reload the data to reflect the change (assuming state was changed elsewhere).
    console.log(`Deleting destination with ID: ${id}`);
    // A placeholder for the actual deletion logic from the state array.
    loadAdminData();
}