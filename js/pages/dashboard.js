// js/pages/dashboard.js
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader, showModal, hideModal, getCategoryLabel } from '../ui.js';
import { fetchDestinations } from '../api.js';

// --- Lógica del Dashboard ---
export async function loadDashboardData() {
    showLoader();
    const destinations = await fetchDestinations();
    state.destinations = destinations;
    populateEisenhowerMatrix(destinations);
    hideLoader();
}

function populateEisenhowerMatrix(destinations) {
    // Clear containers
    DOM.urgentImportantContainer.innerHTML = '<h3>Tus Preferencias (Urgente e Importante)</h3>';
    DOM.notUrgentImportantContainer.innerHTML = '<h3>Relacionado (Importante, No Urgente)</h3>';
    DOM.urgentNotImportantContainer.innerHTML = '<h3>Podría Interesarte (Urgente, No Importante)</h3>';
    DOM.notUrgentNotImportantContainer.innerHTML = '<h3>Otros Lugares (No Urgente, No Importante)</h3>';

    const relatedCategories = {
        'gastronomico': ['recreativo'],
        'cultural': ['historico', 'educativo'],
        'educativo': ['cultural', 'historico'],
        'recreativo': ['natural', 'gastronomico'],
        'historico': ['cultural', 'educativo'],
        'natural': ['recreativo']
    };
    const addedIds = new Set();

    // 1. "Your preferences"
    destinations.forEach(d => {
        if (state.userInterests.includes(d.category)) {
            DOM.urgentImportantContainer.appendChild(createDestinationCard(d));
            addedIds.add(d.id);
        }
    });

    // 2. "Related"
    destinations.forEach(d => {
        if (!addedIds.has(d.id) && state.userInterests.some(cat => (relatedCategories[cat] || []).includes(d.category))) {
            DOM.notUrgentImportantContainer.appendChild(createDestinationCard(d));
            addedIds.add(d.id);
        }
    });

    // 3. Populate remaining
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

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            showDestinationDetails(destination);
        }
    });

    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(destination.id);
        e.currentTarget.classList.toggle('active');
    });
    return card;
}

// --- Lógica de Modales de Destino e Intereses ---
export function showInterestModal() {
    showModal(DOM.interestModal);
}

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

function showDestinationDetails(destination) {
    const isFavorite = state.favorites.includes(destination.id);
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
        <div class="map-container"><p><i class="fas fa-map-marked-alt"></i> Mapa de ubicación: ${destination.coordinates}</p></div>
        </div>
        <div class="guides-section">
            <h3>Guías Turísticos Disponibles</h3>
            <div class="guide-list">
                <div class="guide-card">
                    <img src="https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg" alt="Guía 1" class="guide-img">
                    <div class="guide-info">
                        <h4 class="guide-name">Carlos Rodríguez</h4>
                        <p class="guide-bio">Guía turístico con 5 años de experiencia especializado en historia local.</p>
                    </div>
                </div>
                <div class="guide-card">
                    <img src="https://cdn.pixabay.com/photo/2017/06/26/02/47/people-2442565_1280.jpg" alt="Guía 2" class="guide-img">
                    <div class="guide-info">
                        <h4 class="guide-name">María López</h4>
                        <p class="guide-bio">Especialista en ecoturismo con conocimientos en flora y fauna local.</p>
                    </div>
                </div>
                <div class="guide-card">
                    <img src="https://cdn.pixabay.com/photo/2018/02/16/14/38/portrait-3157821_1280.jpg" alt="Guía 3" class="guide-img">
                    <div class="guide-info">
                        <h4 class="guide-name">Juan Pérez</h4>
                        <p class="guide-bio">Guía bilingüe con experiencia en grupos internacionales.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="schedule-section">
            <h3>Horarios Disponibles</h3>
            <div class="schedule-slots"">
                <div class="time-slot">Fecha: ${formattedDate}</div>
            </div>
        </div>
    `;
    
    const favoriteBtn = DOM.destinationDetails.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(destination.id);
        favoriteBtn.classList.toggle('active');
        document.querySelectorAll(`.destination-card .favorite-btn[data-id="${destination.id}"]`).forEach(btn => {
            btn.classList.toggle('active');
        });
    });

    showModal(DOM.destinationModal);
}

export function toggleFavorite(destinationId) {
    const index = state.favorites.indexOf(destinationId);
    if (index === -1) {
        state.favorites.push(destinationId);
    } else {
        state.favorites.splice(index, 1);
    }
    localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
}