// App State
const state = {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    currentPage: 'dashboard',
    userInterests: [],
    favorites: [],
    routePreferences: {},
    destinations: [],
    testimonials: []
};

// DOM Elements
const DOM = {
    // Auth section
    authSection: document.getElementById('authSection'),
    loginTab: document.getElementById('loginTab'),
    registerTab: document.getElementById('registerTab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    registerName: document.getElementById('registerName'),
    registerEmail: document.getElementById('registerEmail'),
    registerPassword: document.getElementById('registerPassword'),
    confirmPassword: document.getElementById('confirmPassword'),
    
    // App section
    appHeader: document.getElementById('appHeader'),
    appSidebar: document.getElementById('appSidebar'),
    appContent: document.getElementById('appContent'),
    userNameDisplay: document.getElementById('userNameDisplay'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminMenuItem: document.getElementById('adminMenuItem'),
    
    // Pages
    dashboardPage: document.getElementById('dashboardPage'),
    favoritesPage: document.getElementById('favoritesPage'),
    testimonialsPage: document.getElementById('testimonialsPage'),
    adminPage: document.getElementById('adminPage'),

    routePlannerPage: document.getElementById('routePlannerPage'),
    routeQuestionsContainer: document.getElementById('routeQuestionsContainer'),
    sortedRouteContainer: document.getElementById('sortedRouteContainer'),
    
    // Dashboard containers
    urgentImportantContainer: document.getElementById('urgentImportantContainer'),
    notUrgentImportantContainer: document.getElementById('notUrgentImportantContainer'),
    urgentNotImportantContainer: document.getElementById('urgentNotImportantContainer'),
    notUrgentNotImportantContainer: document.getElementById('notUrgentNotImportantContainer'),
    
    // Favorites
    favoritesGrid: document.getElementById('favoritesGrid'),
    
    // Admin
    destinationsTable: document.getElementById('destinationsTable'),
    addDestinationBtn: document.getElementById('addDestinationBtn'),
    
    // Modals
    interestModal: document.getElementById('interestModal'),
    closeInterestModal: document.getElementById('closeInterestModal'),
    categoryOptions: document.getElementById('categoryOptions'),
    skipInterestBtn: document.getElementById('skipInterestBtn'),
    saveInterestBtn: document.getElementById('saveInterestBtn'),
    
    destinationModal: document.getElementById('destinationModal'),
    closeDestinationModal: document.getElementById('closeDestinationModal'),
    destinationDetails: document.getElementById('destinationDetails'),
    
    destinationFormModal: document.getElementById('destinationFormModal'),
    closeDestinationFormModal: document.getElementById('closeDestinationFormModal'),
    formModalTitle: document.getElementById('formModalTitle'),
    destinationForm: document.getElementById('destinationForm'),
    destinationId: document.getElementById('destinationId'),
    destinationName: document.getElementById('destinationName'),
    destinationCategory: document.getElementById('destinationCategory'),
    destinationDescription: document.getElementById('destinationDescription'),
    destinationImageUrl: document.getElementById('destinationImageUrl'),
    destinationLocation: document.getElementById('destinationLocation'),
    destinationCoordinates: document.getElementById('destinationCoordinates'),
    cancelDestinationForm: document.getElementById('cancelDestinationForm'),
    saveDestinationForm: document.getElementById('saveDestinationForm'),
    
    // Testimonials
    testimonialsSlider: document.getElementById('testimonialsSlider'),
    
    // Loader
    loader: document.querySelector('.loader')
};

// Initialize App
function init() {
    // Check if user is logged in (from localStorage)
    checkAuthState();
    
    // Event Listeners
    setupEventListeners();
    
    // If logged in, load data
    if (state.isLoggedIn) {
        loadUserData();
    }
}

// Check Authentication State
function checkAuthState() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        state.isLoggedIn = true;
        state.user = JSON.parse(userData);
        state.isAdmin = state.user.role === 'admin';
        
        // Show app UI
        showAppUI();
    } else {
        // Show auth UI
        showAuthUI();
    }
}

// Show App UI
function showAppUI() {
    DOM.authSection.style.display = 'none';
    DOM.appHeader.style.display = 'block';
    DOM.appSidebar.style.display = 'block';
    DOM.appContent.style.display = 'block';
    
    // Update user name display
    DOM.userNameDisplay.textContent = state.user.name;
    
    // Show admin menu if admin
    if (state.isAdmin) {
        DOM.adminMenuItem.style.display = 'block';
    }
    
    // Load interests modal if first login
    const hasSetInterests = localStorage.getItem('userInterests');
    if (!hasSetInterests) {
        showInterestModal();
    } else {
        state.userInterests = JSON.parse(hasSetInterests);
        loadDashboardData();
    }
}

// Show Auth UI
function showAuthUI() {
    DOM.authSection.style.display = 'flex';
    DOM.appHeader.style.display = 'none';
    DOM.appSidebar.style.display = 'none';
    DOM.appContent.style.display = 'none';
}

// Setup Event Listeners
function setupEventListeners() {
    // Auth Tabs
    DOM.loginTab.addEventListener('click', () => {
        DOM.loginTab.classList.add('active');
        DOM.registerTab.classList.remove('active');
        DOM.loginForm.classList.add('active');
        DOM.registerForm.classList.remove('active');
    });
    
    DOM.registerTab.addEventListener('click', () => {
        DOM.registerTab.classList.add('active');
        DOM.loginTab.classList.remove('active');
        DOM.registerForm.classList.add('active');
        DOM.loginForm.classList.remove('active');
    });
    
    // Login Form
    DOM.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // Register Form
    DOM.registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
    
    // Logout Button
    DOM.logoutBtn.addEventListener('click', handleLogout);
    
    // Sidebar Navigation
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            changePage(page);
        });
    });
    
    // Interest Modal
    DOM.closeInterestModal.addEventListener('click', () => {
        hideModal(DOM.interestModal);
    });
    
    DOM.categoryOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.category-option');
        if (option) {
            option.classList.toggle('selected');
        }
    });
    
    DOM.skipInterestBtn.addEventListener('click', () => {
        hideModal(DOM.interestModal);
        loadDashboardData();
    });
    
    DOM.saveInterestBtn.addEventListener('click', saveUserInterests);
    
    // Destination Modal
    DOM.closeDestinationModal.addEventListener('click', () => {
        hideModal(DOM.destinationModal);
    });
    
    // Destination Form Modal
    DOM.addDestinationBtn.addEventListener('click', showAddDestinationForm);
    DOM.closeDestinationFormModal.addEventListener('click', () => {
        hideModal(DOM.destinationFormModal);
    });
    DOM.cancelDestinationForm.addEventListener('click', () => {
        hideModal(DOM.destinationFormModal);
    });
    DOM.saveDestinationForm.addEventListener('click', saveDestination);

    DOM.routeQuestionsContainer.addEventListener('click', function(e) {
    const button = e.target.closest('button.btn');
    if (!button) return;

    const id = parseInt(button.dataset.id);
    const type = button.dataset.type; // 'urgent' o 'important'
    const value = button.dataset.value === 'true'; // Convertir string a boolean

    // Inicializar el objeto de preferencias si no existe
    if (!state.routePreferences[id]) {
        state.routePreferences[id] = {};
    }

    // Actualizar la preferencia
    state.routePreferences[id][type] = value;
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('routePreferences', JSON.stringify(state.routePreferences));
    
    // Volver a renderizar la página para que se actualice el estado visual de los botones y la ruta
    renderRoutePlannerPage();
    }); 
}

// Handle Login
function handleLogin() {
    const email = DOM.loginEmail.value.trim();
    const password = DOM.loginPassword.value.trim();
    
    // Simple validation
    if (!validateEmail(email)) {
        showError(DOM.loginEmail, 'loginEmailError');
        return;
    }
    
    if (password.length < 6) {
        showError(DOM.loginPassword, 'loginPasswordError');
        return;
    }
    
    showLoader();
    
    // In a real app, this would be an API call
    setTimeout(() => {
        // For demo, use hardcoded admin/user credentials
        if (email === 'admin@example.com' && password === 'admin123') {
            loginSuccess({
                id: 1,
                name: 'Administrador',
                email: 'admin@example.com',
                role: 'admin'
            });
        } else if (email === 'user@example.com' && password === 'user123') {
            loginSuccess({
                id: 2,
                name: 'Usuario Demo',
                email: 'user@example.com',
                role: 'user'
            });
        } else {
            // Login failed
            alert('Credenciales incorrectas. Por favor intente de nuevo.');
            hideLoader();
        }
    }, 1000);
}

// Login Success
function loginSuccess(user) {
    state.isLoggedIn = true;
    state.user = user;
    state.isAdmin = user.role === 'admin';
    
    // Save to localStorage
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('userData', JSON.stringify(user));
    
    // Show app UI
    showAppUI();
    hideLoader();
}

// Handle Register
function handleRegister() {
    const name = DOM.registerName.value.trim();
    const email = DOM.registerEmail.value.trim();
    const password = DOM.registerPassword.value.trim();
    const confirmPassword = DOM.confirmPassword.value.trim();
    
    // Simple validation
    let isValid = true;
    
    if (name === '') {
        showError(DOM.registerName, 'registerNameError');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showError(DOM.registerEmail, 'registerEmailError');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError(DOM.registerPassword, 'registerPasswordError');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showError(DOM.confirmPassword, 'confirmPasswordError');
        isValid = false;
    }
    
    if (!isValid) return;
    
    showLoader();
    
    // In a real app, this would be an API call
    setTimeout(() => {
        // Register success, auto login
        loginSuccess({
            id: 3,
            name: name,
            email: email,
            role: 'user'
        });
        
        hideLoader();
    }, 1000);
}

// Handle Logout
function handleLogout() {
    state.isLoggedIn = false;
    state.user = null;
    state.isAdmin = false;
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userInterests');
    localStorage.removeItem('userFavorites');
    
    // Show auth UI
    showAuthUI();
}

// Change Page
function changePage(page) {
    // Hide all pages
    DOM.dashboardPage.style.display = 'none';
    DOM.favoritesPage.style.display = 'none';
    DOM.testimonialsPage.style.display = 'none';
    DOM.adminPage.style.display = 'none';
    DOM.routePlannerPage.style.display = 'none'; 
    
    // Remove active class from sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active page
    state.currentPage = page;
    
    // Show selected page and set active link
    document.querySelector(`.sidebar-link[data-page="${page}"]`).classList.add('active');
    
    if (page === 'dashboard') {
        DOM.dashboardPage.style.display = 'block';
        if (!state.destinations.length) {
            loadDashboardData();
        }
    } else if (page === 'favorites') {
        DOM.favoritesPage.style.display = 'block';
        loadFavorites();
    } else if (page === 'routePlanner') {
        DOM.routePlannerPage.style.display = 'block';
        renderRoutePlannerPage();
    } else if (page === 'testimonials') {
        DOM.testimonialsPage.style.display = 'block';
        loadTestimonials();
    } else if (page === 'admin') {
        // Only show admin page if user is admin
        if (state.isAdmin) {
            DOM.adminPage.style.display = 'block';
            loadAdminData();
        } else {
            // If not admin, redirect to dashboard
            changePage('dashboard');
        }
    }
}

function renderRoutePlannerPage() {
    showLoader();
    DOM.routeQuestionsContainer.innerHTML = ''; // Limpiar contenido previo
    DOM.sortedRouteContainer.innerHTML = '';   // Limpiar contenido previo

    if (state.favorites.length === 0) {
        DOM.routeQuestionsContainer.innerHTML = `<p>Aún no has añadido lugares a tus favoritos. ¡Ve al Dashboard y pulsa el ❤️ en los que te gusten para empezar!</p>`;
        hideLoader();
        return;
    }

    // Crear una tarjeta de preguntas para cada favorito
    state.favorites.forEach(favId => {
        const destination = state.destinations.find(d => d.id === favId);
        if (!destination) return;

        const prefs = state.routePreferences[favId] || {};

        const card = document.createElement('div');
        card.className = 'destination-card'; // Reutilizamos los estilos de las tarjetas
        card.style.marginBottom = '20px';
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
            </div>
        `;
        DOM.routeQuestionsContainer.appendChild(card);
    });

    // Generar la ruta ordenada si ya hay preferencias
    displaySortedRoute();
    hideLoader();
}

function displaySortedRoute() {
    DOM.sortedRouteContainer.innerHTML = ''; // Limpiar

    const categories = {
        'IU': [], // Importante y Urgente
        'INU': [], // Importante, No Urgente
        'NIU': [], // No Importante, Urgente
        'NINU': [] // No Importante, No Urgente
    };

    state.favorites.forEach(favId => {
        const dest = state.destinations.find(d => d.id === favId);
        const prefs = state.routePreferences[favId];
        if (!dest || !prefs || typeof prefs.important === 'undefined' || typeof prefs.urgent === 'undefined') {
            return; 
        }

        if (prefs.important && prefs.urgent) categories.IU.push(dest);
        else if (prefs.important && !prefs.urgent) categories.INU.push(dest);
        else if (!prefs.important && prefs.urgent) categories.NIU.push(dest);
        else categories.NINU.push(dest);
    });

    if (Object.values(categories).every(arr => arr.length === 0)) {
        return;
    }

    // Usamos las nuevas clases CSS que acabamos de crear
    let routeHTML = `
        <div class="sorted-route-panel">
            <h3><i class="fas fa-route"></i> Tu Ruta Sugerida</h3>
            <ol class="sorted-route-list">
    `;
    
    // Emojis y Títulos para cada sección
    const sectionDetails = {
        IU: { title: '¡Hazlo Ahora! (Importante y Urgente)', emoji: '🔥' },
        INU: { title: 'Planifica (Importante, No Urgente)', emoji: '🗓️' },
        NIU: { title: 'Delega o Hazlo Rápido (No Importante, Urgente)', emoji: '⚡' },
        NINU: { title: 'Considera Omitir (No Importante, No Urgente)', emoji: '🗑️' }
    };

    ['IU', 'INU', 'NIU', 'NINU'].forEach(key => {
        if (categories[key].length > 0) {
            // Añadimos el título de la categoría
            routeHTML += `<h4 class="route-category-title">${sectionDetails[key].emoji} ${sectionDetails[key].title}</h4>`;
            
            // Añadimos los destinos de esa categoría
            categories[key].forEach(dest => {
                routeHTML += `
                    <li class="route-item">
                        <span class="route-indicator indicator-${key.toLowerCase()}"></span>
                        ${dest.name} <span style="color: #888; margin-left: 8px;">(${dest.location})</span>
                    </li>
                `;
            });
        }
    });

    routeHTML += `</ol></div>`;
    DOM.sortedRouteContainer.innerHTML = routeHTML;
}

// Show Interest Modal
function showInterestModal() {
    showModal(DOM.interestModal);
}

// Save User Interests
function saveUserInterests() {
    const selectedInterests = [];
    document.querySelectorAll('.category-option.selected').forEach(option => {
        selectedInterests.push(option.dataset.category);
    });
    
    state.userInterests = selectedInterests;
    
    // Save to localStorage
    localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
    
    // Hide modal
    hideModal(DOM.interestModal);
    
    // Load dashboard data
    loadDashboardData();
}

// Load User Data
function loadUserData() {
    // Load user interests
    const interests = localStorage.getItem('userInterests');
    if (interests) {
        state.userInterests = JSON.parse(interests);
    }
    
    // Load user favorites
    const favorites = localStorage.getItem('userFavorites');
    if (favorites) {
        state.favorites = JSON.parse(favorites);
    }
    
    const routePrefs = localStorage.getItem('routePreferences');
    if (routePrefs) {
        state.routePreferences = JSON.parse(routePrefs);
    }

    // Load initial data
    loadDashboardData();
}

// Load Dashboard Data using Fetch API
async function loadDashboardData() {
    showLoader();

    try {
        // Fetch data from the local JSON file
        const response = await fetch('./databases/db.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const destinations = await response.json();
        state.destinations = destinations;
        
        // Populate the UI with the fetched data
        populateEisenhowerMatrix(destinations);

    } catch (error) {
        console.error("Could not load destinations:", error);
        // Optionally, display an error message to the user in the UI
    } finally {
        hideLoader();
    }
}

// Populate Eisenhower Matrix
function populateEisenhowerMatrix(destinations) {
    // Clear containers
    DOM.urgentImportantContainer.innerHTML = '';
    DOM.notUrgentImportantContainer.innerHTML = '';
    DOM.urgentNotImportantContainer.innerHTML = '';
    DOM.notUrgentNotImportantContainer.innerHTML = '';

    // Define relationships between categories
    const relatedCategories = {
        'gastronomico': ['cultural', 'recreativo'],
        'cultural': ['historico', 'educativo'],
        'educativo': ['cultural', 'historico'],
        'recreativo': ['natural', 'gastronomico'],
        'historico': ['cultural', 'educativo'],
        'natural': ['recreativo']
    };

    // Use a Set to track added destination IDs to avoid duplicates
    const addedIds = new Set();

    // 1. "Tus preferencias" quadrant (Urgent & Important)
    destinations.forEach(destination => {
        if (state.userInterests.includes(destination.category)) {
            DOM.urgentImportantContainer.appendChild(createDestinationCard(destination));
            addedIds.add(destination.id);
        }
    });

    // 2. "Lugares relacionados" quadrant (Not Urgent & Important)
    destinations.forEach(destination => {
        if (
            !addedIds.has(destination.id) &&
            state.userInterests.some(cat => (relatedCategories[cat] || []).includes(destination.category))
        ) {
            DOM.notUrgentImportantContainer.appendChild(createDestinationCard(destination));
            addedIds.add(destination.id);
        }
    });

    // 3. Populate remaining two quadrants
    const remainingDestinations = destinations.filter(d => !addedIds.has(d.id));
    const half = Math.ceil(remainingDestinations.length / 2);
    
    remainingDestinations.forEach((destination, index) => {
        if (index < half) {
            // "Podría interesarte" quadrant (Urgent & Not Important)
            DOM.urgentNotImportantContainer.appendChild(createDestinationCard(destination));
        } else {
            // "Otros lugares" quadrant (Not Urgent & Not Important)
            DOM.notUrgentNotImportantContainer.appendChild(createDestinationCard(destination));
        }
    });
}

// Create Destination Card
function createDestinationCard(destination) {
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
            <p class="card-description">${destination.description}</p>
        </div>
        <div class="card-footer">
            <div class="card-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${destination.location}</span>
            </div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${destination.id}">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;
    
    // Add event listener to card
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            showDestinationDetails(destination);
        }
    });
    
    // Add event listener to favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(destination.id);
        favoriteBtn.classList.toggle('active');
    });
    
    return card;
}

// Show Destination Details
function showDestinationDetails(destination) {
    const isFavorite = state.favorites.includes(destination.id);
    
    DOM.destinationDetails.innerHTML = `
        <div class="details-header">
            <div>
                <h2 class="details-title">${destination.name}</h2>
                <span class="details-category">${getCategoryLabel(destination.category)}</span>
            </div>
            <div class="details-actions">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${destination.id}" style="font-size: 24px;">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
        <img src="${destination.imageUrl}" alt="${destination.name}" class="details-img">
        <p class="details-description">${destination.description}</p>
        <div class="map-container">
            <p><i class="fas fa-map-marked-alt" style="font-size: 24px;"></i><br>Mapa de ubicación<br>${destination.coordinates}</p>
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
            <div class="schedule-slots">
                <div class="time-slot">9:00 AM - 11:00 AM</div>
                <div class="time-slot">11:30 AM - 1:30 PM</div>
                <div class="time-slot">2:00 PM - 4:00 PM</div>
                <div class="time-slot">4:30 PM - 6:30 PM</div>
            </div>
        </div>
    `;
    
    // Add event listener to favorite button
    const favoriteBtn = DOM.destinationDetails.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        toggleFavorite(destination.id);
        favoriteBtn.classList.toggle('active');
        
        // Update all cards with the same destination
        document.querySelectorAll(`.favorite-btn[data-id="${destination.id}"]`).forEach(btn => {
            btn.classList.toggle('active');
        });
    });
    
    // Show modal
    showModal(DOM.destinationModal);
}

// Toggle Favorite
function toggleFavorite(destinationId) {
    const index = state.favorites.indexOf(destinationId);
    if (index === -1) {
        // Add to favorites
        state.favorites.push(destinationId);
    } else {
        // Remove from favorites
        state.favorites.splice(index, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
}

// Load Favorites
function loadFavorites() {
    showLoader();
    
    // In a real app, this would be an API call
    setTimeout(() => {
        DOM.favoritesGrid.innerHTML = '';
        
        if (state.favorites.length === 0) {
            DOM.favoritesGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 30px;">No tienes destinos favoritos. Explora el Dashboard y agrega algunos.</p>';
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

// Load Testimonials
function loadTestimonials() {
    showLoader();
    // Slider state
    let currentTestimonialIndex = 0;
    // In a real app, this would be an API call
    setTimeout(() => {
        const mockTestimonials = [
            {
                id: 1,
                name: 'Laura Gómez',
                role: 'Turista de Bogotá',
                image: 'https://image.shutterstock.com/image-photo/young-hispanic-girl-holding-colombia-260nw-2139014159.jpg',
                content: 'Visitar el Atlántico fue una experiencia increíble. Los lugares son hermosos y la gente muy amable. Definitivamente volveré pronto.'
            },
            {
                id: 2,
                name: 'Pedro Martínez',
                role: 'Viajero Internacional',
                image: 'https://definicion.de/wp-content/uploads/2008/05/hombre-1.jpg',
                content: 'El Volcán del Totumo fue una experiencia única. Los guías turísticos son muy profesionales y conocen muy bien la región.'
            },
            {
                id: 3,
                name: 'Ana Rodríguez',
                role: 'Fotógrafa de Viajes',
                image: 'https://sd-hegemone-production.sdcdns.com/dictionary-images/600/6fa87ce6-25e8-4c27-887a-2d2eaece0590.jpg',
                content: 'La diversidad cultural del Atlántico es impresionante. Pude capturar imágenes increíbles de sus paisajes y tradiciones.'
            },
        ];
        state.testimonials = mockTestimonials;

        function renderTestimonial(index) {
            const testimonial = mockTestimonials[index];
            DOM.testimonialsSlider.innerHTML = `
                <div class="testimonial">
                    <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-img">
                    <p class="testimonial-content">"${testimonial.content}"</p>
                    <h4 class="testimonial-author">${testimonial.name}</h4>
                    <p class="testimonial-role">${testimonial.role}</p>
                </div>
            `;
        }

        renderTestimonial(currentTestimonialIndex);

        // Navigation buttons
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');

        // Remove previous listeners to avoid duplicates
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        nextBtn.replaceWith(nextBtn.cloneNode(true));

        // Re-select the cloned nodes
        const prevBtnNew = document.querySelector('.slider-prev');
        const nextBtnNew = document.querySelector('.slider-next');

        prevBtnNew.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + mockTestimonials.length) % mockTestimonials.length;
            renderTestimonial(currentTestimonialIndex);
        });
        nextBtnNew.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % mockTestimonials.length;
            renderTestimonial(currentTestimonialIndex);
        });

        hideLoader();
    }, 500);
}

// Load Admin Data
function loadAdminData() {
    showLoader();
    
    // In a real app, this would be an API call
    setTimeout(() => {
        // Populate admin table
        DOM.destinationsTable.innerHTML = '';
        
        state.destinations.forEach(destination => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${destination.name}</td>
                <td>${getCategoryLabel(destination.category)}</td>
                <td>${destination.location}</td>
                <td>
                    <div class="action-buttons">
                        <button class="view-btn" data-id="${destination.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn" data-id="${destination.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${destination.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Add event listeners
            row.querySelector('.view-btn').addEventListener('click', () => {
                showDestinationDetails(destination);
            });
            
            row.querySelector('.edit-btn').addEventListener('click', () => {
                showEditDestinationForm(destination);
            });
            
            row.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas eliminar este destino?')) {
                    deleteDestination(destination.id);
                }
            });
            
            DOM.destinationsTable.appendChild(row);
        });
        
        hideLoader();
    }, 500);
}

// Show Add Destination Form
function showAddDestinationForm() {
    // Reset form
    DOM.formModalTitle.textContent = 'Agregar Nuevo Destino';
    DOM.destinationForm.reset();
    DOM.destinationId.value = '';
    
    showModal(DOM.destinationFormModal);
}

// Show Edit Destination Form
function showEditDestinationForm(destination) {
    // Set form values
    DOM.formModalTitle.textContent = 'Editar Destino';
    DOM.destinationId.value = destination.id;
    DOM.destinationName.value = destination.name;
    DOM.destinationCategory.value = destination.category;
    DOM.destinationDescription.value = destination.description;
    DOM.destinationImageUrl.value = destination.imageUrl;
    DOM.destinationLocation.value = destination.location;
    DOM.destinationCoordinates.value = destination.coordinates;
    
    showModal(DOM.destinationFormModal);
}

// Save Destination
function saveDestination() {
    const id = DOM.destinationId.value;
    const name = DOM.destinationName.value.trim();
    const category = DOM.destinationCategory.value;
    const description = DOM.destinationDescription.value.trim();
    const imageUrl = DOM.destinationImageUrl.value.trim();
    const location = DOM.destinationLocation.value.trim();
    const coordinates = DOM.destinationCoordinates.value.trim();
    
    // Simple validation
    if (!name || !category || !description || !imageUrl || !location) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    showLoader();
    
    // In a real app, this would be an API call
    setTimeout(() => {
        if (id) {
            // Update existing destination
            const index = state.destinations.findIndex(d => d.id == id);
            if (index !== -1) {
                state.destinations[index] = {
                    ...state.destinations[index],
                    name,
                    category,
                    description,
                    imageUrl,
                    location,
                    coordinates
                };
            }
        } else {
            // Add new destination
            const newId = state.destinations.length > 0 ? Math.max(...state.destinations.map(d => d.id)) + 1 : 1;
            state.destinations.push({
                id: newId,
                name,
                category,
                description,
                imageUrl,
                location,
                coordinates,
                urgency: 'low',
                importance: 'low'
            });
        }
        
        // Refresh data
        loadAdminData();
        
        // Hide modal
        hideModal(DOM.destinationFormModal);
        
        hideLoader();
    }, 500);
}

// Delete Destination
function deleteDestination(id) {
    showLoader();
    
    // In a real app, this would be an API call
    setTimeout(() => {
        // Remove destination
        const index = state.destinations.findIndex(d => d.id == id);
        if (index !== -1) {
            state.destinations.splice(index, 1);
        }
        
        // Remove from favorites if exists
        const favIndex = state.favorites.indexOf(parseInt(id));
        if (favIndex !== -1) {
            state.favorites.splice(favIndex, 1);
            localStorage.setItem('userFavorites', JSON.stringify(state.favorites));
        }
        
        // Refresh data
        loadAdminData();
        
        hideLoader();
    }, 500);
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, errorId) {
    input.style.borderColor = '#dc3545';
    document.getElementById(errorId).style.display = 'block';
    
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        document.getElementById(errorId).style.display = 'none';
    }, { once: true });
}

function showLoader() {
    DOM.loader.classList.add('show');
}

function hideLoader() {
    DOM.loader.classList.remove('show');
}

function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function getCategoryLabel(category) {
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);