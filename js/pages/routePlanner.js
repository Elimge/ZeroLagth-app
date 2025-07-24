// js/pages/routePlanner.js
import { showLoader, hideLoader, showModal, hideModal } from '../ui.js';
import { state } from '../state.js';
import { DOM } from '../dom.js';

let currentDestinationId = null;

function scheduleEventNotification(destinationId) {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
        return;
    }

    const destination = state.destinations.find(d => d.id === destinationId);
    if (!destination || !destination.eventDate) return;

    const notificationTime = new Date(destination.eventDate).getTime();
    const now = new Date().getTime();

    const oneHourInMs = 60 * 60 * 1000;
    const adjustedNotificationTime = notificationTime - oneHourInMs;

    if (adjustedNotificationTime > now) {
        const timeUntilNotification = adjustedNotificationTime - now;

        // Guardar el ID del timeout para poder cancelarlo si es necesario
        if (!state.routePreferences[destinationId]) {
            state.routePreferences[destinationId] = {};
        }

        // Cancelar notificación anterior si existe
        if (state.routePreferences[destinationId].notificationTimeout) {
            clearTimeout(state.routePreferences[destinationId].notificationTimeout);
        }

        // Programar nueva notificación
        const timeoutId = setTimeout(() => {
            const prefs = state.routePreferences[destinationId];
            const notification = new Notification(`¡Es hora de visitar ${destination.name}!`, {
                body: `Haz clic para ver detalles.`,
                icon: destination.imageUrl || '/favicon.ico',
                badge: '/favicon.ico',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                currentDestinationId = destinationId;
                showVisitConfirmModal();
            };
        }, timeUntilNotification);


        // Guardar referencia al timeout
        state.routePreferences[destinationId].notificationTimeout = timeoutId;
        localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));
    }
}

function showVisitConfirmModal() {
    if (!DOM.visitConfirmModal || currentDestinationId === null) return;

    const destination = state.destinations.find(d => d.id === currentDestinationId);
    const prefs = state.routePreferences[currentDestinationId];

    if (!destination || !prefs) return;

    // Armar contenido HTML con la información
    const htmlContent = `
        <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin-botton:1em;">Confirmar Visita a ${destination.name}</h3>
        <div style="width: 100%; height: 200px; background-image: url('${destination.imageUrl}'); background-size: cover; background-position: center; border-radius: 10px; margin-bottom: 20px;"></div>
        <div class="destination-details" style="margin-bottom: 20px;">
        <p>${destination.description}</p>
        <p>${destination.location}</p>
        <p><strong>Fecha del Evento:</strong> Hoy ${destination.eventDate ? new Date(destination.eventDate).toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) : 'Fecha no establecida'}</p>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <table style="width: 400px; border-collapse: collapse; margin-bottom: 20px;">
            <tr">
                <th style="text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">PROS</th>
                <th style="text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">CONTRAS</th>
            </tr>
            <tr">
                <td style="text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">${prefs.pros || 'No especificados'}</td>
                <td style="text-align: center; padding: 10px; border-bottom: 1px solid #ddd;">${prefs.cons || 'No especificados'}</td>
            </tr>
        </table>
        </div>
        </div>
    `;

    // Insertar contenido en el modal
    DOM.prosConsList.innerHTML = htmlContent;

    // Mostrar modal
    showModal(DOM.visitConfirmModal);
}


// Event listeners para los botones de preguntas
DOM.routeQuestionsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-type]');
    if (!button) return;
});

document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
});

export function renderRoutePlannerPage() {
    showLoader();

    // Configurar modales y event listeners
    setupModalListeners();

    // Limpiar contenedores
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

        // Agregar un identificador único al card
        card.dataset.destinationId = favId;
        const eventDate = destination.eventDate ? new Date(destination.eventDate) : null;
        const formattedDate = eventDate ?
            eventDate.toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Fecha no establecida';

        card.innerHTML = `
            <div class="card-content">
                <h3 class="card-title">${destination.name}</h3>
                <p class="event-date"><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
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

// Configurar los event listeners para los modales y botones
function setupModalListeners() {
    // Configurar los botones de cerrar modales
    DOM.closeProsModal.onclick = () => {
        hideModal(DOM.prosModal);
        currentDestinationId = null;
    };

    DOM.closeConsModal.onclick = () => {
        hideModal(DOM.consModal);
        currentDestinationId = null;
    };

    DOM.closeVisitConfirmModal.onclick = () => {
        hideModal(DOM.visitConfirmModal);
        currentDestinationId = null;
    };

    // Event listener para los botones de preguntas
    DOM.routeQuestionsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-type]');
        if (!button) return;

        const id = parseInt(button.dataset.id);
        const type = button.dataset.type;
        const value = button.dataset.value === 'true';

        // Actualizar estado
        if (!state.routePreferences[id]) {
            state.routePreferences[id] = {};
        }
        state.routePreferences[id][type] = value;

        // Actualizar visual de botones
        const container = button.closest('.action-buttons');
        container.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('btn-primary', 'btn-outline');
            btn.classList.add(btn.dataset.value === String(value) ? 'btn-primary' : 'btn-outline');
        });

        // Verificar si ambas preguntas están respondidas
        const prefs = state.routePreferences[id];
        if (typeof prefs.urgent !== 'undefined' && typeof prefs.important !== 'undefined') {
            currentDestinationId = id;
            // Limpiar textarea
            DOM.prosText.value = '';
            // Mostrar modal de pros
            showModal(DOM.prosModal);
        }
    });

    // Event listener para guardar pros y mostrar modal de contras
    DOM.saveProsBtn.onclick = (e) => {
        e.preventDefault();
        const prosText = DOM.prosText.value.trim();
        if (!prosText) {
            alert('Por favor, ingresa al menos un beneficio');
            return;
        }

        if (!state.routePreferences[currentDestinationId]) {
            state.routePreferences[currentDestinationId] = {};
        }
        state.routePreferences[currentDestinationId].pros = prosText;

        hideModal(DOM.prosModal);

        // Limpiar el texto anterior si existe
        DOM.consText.value = '';

        // Mostrar el modal de contras
        setTimeout(() => {
            showModal(DOM.consModal);
        }, 100);
    };

    // Event listener para guardar contras y finalizar
    DOM.saveConsBtn.onclick = (e) => {
        e.preventDefault();
        const consText = DOM.consText.value.trim();
        if (!consText) {
            alert('Por favor, ingresa al menos una desventaja');
            return;
        }

        if (!state.routePreferences[currentDestinationId]) {
            state.routePreferences[currentDestinationId] = {};
        }
        state.routePreferences[currentDestinationId].cons = consText;

        // Guardar en localStorage
        localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));

        hideModal(DOM.consModal);

        // Mostrar mensaje de éxito
        alert('¡Información guardada con éxito!');

        // Programar notificación si hay fecha
        const destination = state.destinations.find(d => d.id === currentDestinationId);
        if (destination && destination.eventDate) {
            scheduleEventNotification(currentDestinationId);
        }

        currentDestinationId = null;
    };
}

DOM.yesVisitBtn.onclick = () => {
    hideModal(DOM.visitConfirmModal);
    const destination = state.destinations.find(d => d.id === currentDestinationId);
    if (destination) {  
        // Aquí puedes agregar la lógica para marcar el destino como visitado o realizar alguna acción
        alert(`¡Has confirmado tu visita a ${destination.name}!`);
    }
}

DOM.noVisitBtn.onclick = () => {
    if (currentDestinationId === null) return;

    const destination = state.destinations.find(d => d.id === currentDestinationId);
    if (!destination) return;

    // Cancelar la notificación programada si existe
    const prefs = state.routePreferences[currentDestinationId];
    if (prefs?.notificationTimeout) {
        clearTimeout(prefs.notificationTimeout);
    }

    //Eliminar de favoritos
    state.favorites = state.favorites.filter(id => id !== currentDestinationId);

    //Eliminar preferencias asociadas
    delete state.routePreferences[currentDestinationId];

    //Guardar cambios en localStorage
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));

    //Volver a renderizar la vista de la ruta
    renderRoutePlannerPage();

    //Cerrar el modal
    hideModal(DOM.visitConfirmModal);
    alert(`Se ha cancelado la visita a ${destination.name}.`);
    
    currentDestinationId = null;
};


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