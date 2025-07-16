// ============================================================================
//  FocoTour Barranquilla - script.js (FINAL & CLEANED)
// ============================================================================
//  This script contains the entire application logic for FocoTour.
//  It follows a Module Pattern to keep the code organized and maintainable.
// ============================================================================

// =================================
// 1. CENTRALIZED STATE
// The single source of truth for the entire application.
// =================================
const State = {
    currentUser: null,
    allSpots: [], // Will hold all tourist spots from the API
    myRoute: [],  // The user's personalized list of spots to visit
    activeCategory: 'all' // To filter spots by category
};

// =================================
// 2. MODULES
// Each module has a single, clear responsibility.
// =================================

// --- API Module ---
// Responsible for all communication with the backend (in this case, db.json).
const ApiModule = (function() {
    const API_URL = 'api/db.json';

    async function fetchSpots() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            State.allSpots = data.spots; // Store fetched spots in the State
        } catch (error) {
            console.error("Could not fetch tourist spots:", error);
        }
    }

    return {
        fetchSpots
    };
})();

// --- UI Module ---
// Responsible for ALL DOM manipulation. It reads from the State to render the UI.
const UIModule = (function() {
    const DOM = {
        loginScreen: document.getElementById('login-screen'),
        appScreen: document.getElementById('app-screen'),
        welcomeMessage: document.getElementById('welcome-message'),
        spotsContainer: document.getElementById('spots-container'),
        matrixContainer: document.getElementById('eisenhower-matrix'),
        q1: document.getElementById('q1'),
        q2: document.getElementById('q2'),
        q3: document.getElementById('q3'),
        q4: document.getElementById('q4'),
        priorityOverlay: document.getElementById('priority-overlay'),
        priorityList: document.getElementById('priority-list')
    };

    function renderSpots() {
        DOM.spotsContainer.innerHTML = '';
        const filteredSpots = State.allSpots.filter(spot => 
            State.activeCategory === 'all' || spot.category === State.activeCategory
        );

        if (filteredSpots.length === 0) {
            DOM.spotsContainer.innerHTML = '<p>No spots found for this category.</p>';
            return;
        }

        filteredSpots.forEach(spot => {
            const isAdded = State.myRoute.some(routeItem => routeItem.id === spot.id);
            const spotCard = document.createElement('div');
            spotCard.className = 'spot-card';
            spotCard.innerHTML = `
                <img src="${spot.image}" alt="${spot.name}">
                <h3>${spot.name}</h3>
                <p>${spot.description}</p>
                <button class="add-to-route-btn" data-spot-id="${spot.id}" ${isAdded ? 'disabled' : ''}>
                    ${isAdded ? 'Added to Route' : 'Add to My Route'}
                </button>
            `;
            DOM.spotsContainer.appendChild(spotCard);
        });
    }

    function renderMyRouteMatrix() {
        ['q1', 'q2', 'q3', 'q4'].forEach(q => {
            const title = DOM[q].querySelector('h2').outerHTML;
            DOM[q].innerHTML = title;
        });

        State.myRoute.forEach(routeItem => {
            const itemElement = document.createElement('div');
            itemElement.className = 'task';
            itemElement.innerHTML = `
                <span>${routeItem.name}</span>
                <button class="visited-btn" data-route-id="${routeItem.id}">✓ Visited</button>
            `;
            DOM[routeItem.quadrant].appendChild(itemElement);
        });
    }

    function renderPriorityList(prioritizedRoute) {
        DOM.priorityList.innerHTML = '';
        if (prioritizedRoute.length === 0) {
            DOM.priorityList.innerHTML = '<li>Add important or urgent spots to your route to see a plan!</li>';
            return;
        }
        prioritizedRoute.forEach(routeItem => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${routeItem.name}</span> <span class="tag tag-${routeItem.quadrant}">${routeItem.quadrant === 'q1' ? 'DO NOW' : 'PLAN'}</span>`;
            DOM.priorityList.appendChild(li);
        });
    }

    function render() {
        if (State.currentUser) {
            DOM.loginScreen.style.display = 'none';
            DOM.appScreen.style.display = 'block';
            DOM.welcomeMessage.textContent = `Welcome, ${State.currentUser}!`;
            renderSpots();
            renderMyRouteMatrix();
        } else {
            DOM.loginScreen.style.display = 'block';
            DOM.appScreen.style.display = 'none';
        }
    }

    function showPriorityView() {
        DOM.priorityOverlay.style.display = 'flex';
    }

    function hidePriorityView() {
        DOM.priorityOverlay.style.display = 'none';
    }

    return {
        render,
        renderPriorityList,
        showPriorityView,
        hidePriorityView
    };
})();


// --- Auth Module ---
// Responsible for login, logout, and session persistence.
const AuthModule = (function() {
    function login(username) {
        State.currentUser = username;
        localStorage.setItem('currentUser', username);
        RouteModule.loadRoute();
    }

    function logout() {
        const username = State.currentUser;
        if(username) { // Safety check
            localStorage.removeItem(`route_${username}`);
        }
        localStorage.removeItem('currentUser');
        State.currentUser = null;
        State.myRoute = [];
    }

    function checkCurrentUser() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            State.currentUser = user;
            RouteModule.loadRoute();
        }
    }

    return {
        login,
        logout,
        checkCurrentUser
    };
})();


// --- Route Module ---
// Responsible for managing the user's personal route.
const RouteModule = (function() {
    function addSpotToRoute(spotId) {
        if (State.myRoute.some(item => item.id === spotId)) {
            alert("This spot is already in your route.");
            return;
        }

        const spot = State.allSpots.find(s => s.id === spotId);
        if (!spot) return;

        const isUrgent = confirm(`Is visiting "${spot.name}" URGENT?`);
        const isImportant = confirm(`Is visiting "${spot.name}" IMPORTANT?`);

        let quadrant;
        if (isUrgent && isImportant) quadrant = 'q1';
        else if (!isUrgent && isImportant) quadrant = 'q2';
        else if (isUrgent && !isImportant) quadrant = 'q3';
        else quadrant = 'q4';

        const newRouteItem = { ...spot, quadrant };
        State.myRoute.push(newRouteItem);
        saveRoute();
    }

    function saveRoute() {
        if (State.currentUser) {
            localStorage.setItem(`route_${State.currentUser}`, JSON.stringify(State.myRoute));
        }
    }

    function loadRoute() {
        if (State.currentUser) {
            const savedRoute = localStorage.getItem(`route_${State.currentUser}`);
            State.myRoute = savedRoute ? JSON.parse(savedRoute) : [];
        }
    }

    function getPrioritizedRoute() {
        const q1Spots = State.myRoute.filter(item => item.quadrant === 'q1');
        const q2Spots = State.myRoute.filter(item => item.quadrant === 'q2');
        return [...q1Spots, ...q2Spots];
    }

    function markAsVisited(routeItemId) {
        const itemIndex = State.myRoute.findIndex(item => item.id === routeItemId);
        if (itemIndex > -1) {
            State.myRoute.splice(itemIndex, 1);
            saveRoute();
        }
    }

    return {
        addSpotToRoute,
        loadRoute,
        getPrioritizedRoute,
        markAsVisited
    };
})();


// --- App Module (Orchestrator) ---
// Responsible for initializing the app and setting up all event listeners.
const AppModule = (function() {
    function setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username-input').value.trim();
            if (username) {
                AuthModule.login(username);
                UIModule.render();
            }
        });

        document.getElementById('logout-button').addEventListener('click', () => {
            AuthModule.logout();
            UIModule.render();
        });

        document.getElementById('spots-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-route-btn')) {
                const spotId = parseInt(e.target.dataset.spotId);
                RouteModule.addSpotToRoute(spotId);
                UIModule.render();
            }
        });

        document.getElementById('category-filters').addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                State.activeCategory = e.target.dataset.category;
                document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                UIModule.render();
            }
        });

        document.getElementById('prioritize-button').addEventListener('click', () => {
            const prioritizedRoute = RouteModule.getPrioritizedRoute();
            UIModule.renderPriorityList(prioritizedRoute);
            UIModule.showPriorityView();
        });

        document.getElementById('close-priority-button').addEventListener('click', () => {
            UIModule.hidePriorityView();
        });

        // The ONE and ONLY event listener for the matrix
        document.getElementById('eisenhower-matrix').addEventListener('click', (e) => {
            if (e.target.classList.contains('visited-btn')) {
                const routeItemId = parseInt(e.target.dataset.routeId);
                RouteModule.markAsVisited(routeItemId);
                UIModule.render();
            }
        });
    }

    async function init() {
        console.log("FocoTour App Initializing...");
        AuthModule.checkCurrentUser();
        await ApiModule.fetchSpots();
        setupEventListeners();
        UIModule.render();
        console.log("App Ready.");
    }

    return {
        init
    };
})();

// =================================
// 3. START THE APPLICATION
// =================================
document.addEventListener('DOMContentLoaded', AppModule.init);