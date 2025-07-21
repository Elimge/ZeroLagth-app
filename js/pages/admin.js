// js/pages/admin.js
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader, showModal, hideModal, getCategoryLabel } from '../ui.js';

export function loadAdminData() {
    showLoader();
    setTimeout(() => {
        DOM.destinationsTable.innerHTML = '';
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
            
            row.querySelector('.edit-btn').addEventListener('click', () => showEditDestinationForm(destination));
            row.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('¿Estás seguro?')) deleteDestination(destination.id);
            });
            
            DOM.destinationsTable.appendChild(row);
        });
        hideLoader();
    }, 500);
}

export function showAddDestinationForm() {
    DOM.formModalTitle.textContent = 'Agregar Nuevo Destino';
    DOM.destinationForm.reset();
    DOM.destinationId.value = '';
    showModal(DOM.destinationFormModal);
}

function showEditDestinationForm(destination) {
    DOM.formModalTitle.textContent = 'Editar Destino';
    DOM.destinationId.value = destination.id;
    DOM.destinationName.value = destination.name;
    // ... (resto de campos del formulario)
    showModal(DOM.destinationFormModal);
}

export function saveDestination() {
    // ... (lógica para guardar el destino)
    // Al finalizar, actualiza los datos y cierra el modal
    loadAdminData();
    hideModal(DOM.destinationFormModal);
}

function deleteDestination(id) {
    // ... (lógica para eliminar el destino)
    // Al finalizar, actualiza los datos
    loadAdminData();
}