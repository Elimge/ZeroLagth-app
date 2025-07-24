/**
 * @file dom.js
 * @description Centralizes all DOM element selections for the application.
 * This pattern makes the code cleaner, easier to maintain, and less prone to errors
 * from typos in selectors. Each property corresponds to a specific element in the HTML.
 */

/**
 * An object that holds references to all necessary DOM elements,
 * grouped by their functionality or location within the application.
 * @const {Object} DOM
 */
export const DOM = {
    // --- Authentication Section ---
    // The main container for the login/register forms.
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
    
    // --- Main Application Shell ---
    // The main layout wrapper that is hidden during authentication.
    appAll: document.getElementById('appAll'), 
    appHeader: document.getElementById('appHeader'),
    appSidebar: document.getElementById('appSidebar'),
    appContent: document.getElementById('appContent'),
    userNameDisplay: document.getElementById('userNameDisplay'),
    logoutBtn: document.getElementById('logoutBtn'),
    adminMenuItem: document.getElementById('adminMenuItem'),

    // --- Page Containers ---
    // Each element represents a view/page in the Single Page Application.
    dashboardPage: document.getElementById('dashboardPage'),
    favoritesPage: document.getElementById('favoritesPage'),
    testimonialsPage: document.getElementById('testimonialsPage'),
    adminPage: document.getElementById('adminPage'),
    routePlannerPage: document.getElementById('routePlannerPage'),
    
    // --- Route Planner Page Elements ---
    routeQuestionsContainer: document.getElementById('routeQuestionsContainer'),
    sortedRouteContainer: document.getElementById('sortedRouteContainer'),
    
    // --- Dashboard Page Containers ---
    // The four quadrants of the Eisenhower Matrix.
    urgentImportantContainer: document.getElementById('urgentImportantContainer'),
    notUrgentImportantContainer: document.getElementById('notUrgentImportantContainer'),
    urgentNotImportantContainer: document.getElementById('urgentNotImportantContainer'),
    notUrgentNotImportantContainer: document.getElementById('notUrgentNotImportantContainer'),
    
    // --- Favorites Page Elements ---
    favoritesGrid: document.getElementById('favoritesGrid'),
    
    // --- Admin Page Elements ---
    destinationsTable: document.getElementById('destinationsTable'),
    addDestinationBtn: document.getElementById('addDestinationBtn'),
    
    // --- General Modals ---
    // Modal for selecting user interests on first login.
    interestModal: document.getElementById('interestModal'),
    closeInterestModal: document.getElementById('closeInterestModal'),
    categoryOptions: document.getElementById('categoryOptions'),
    skipInterestBtn: document.getElementById('skipInterestBtn'),
    saveInterestBtn: document.getElementById('saveInterestBtn'),
    
    // Modal for displaying detailed information about a destination.
    destinationModal: document.getElementById('destinationModal'),
    closeDestinationModal: document.getElementById('closeDestinationModal'),
    destinationDetails: document.getElementById('destinationDetails'),

    // Modal form for adding or editing a destination (used in Admin page).
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
    
    // --- Pros and Cons Modals (Route Planner) ---
    prosModal: document.getElementById('prosModal'),
    consModal: document.getElementById('consModal'),
    closeProsModal: document.getElementById('closeProsModal'),
    closeConsModal: document.getElementById('closeConsModal'),
    prosText: document.getElementById('prosText'),
    consText: document.getElementById('consText'),
    saveProsBtn: document.getElementById('saveProsBtn'),
    saveConsBtn: document.getElementById('saveConsBtn'),

    // --- Visit Confirmation Modal (from Notifications) ---
    visitConfirmModal: document.getElementById('visitConfirmModal'),
    closeVisitConfirmModal: document.getElementById('closeVisitConfirmModal'),
    prosConsList: document.getElementById('prosConsList'),
    yesVisitBtn: document.getElementById('yesVisitBtn'),
    noVisitBtn: document.getElementById('noVisitBtn'),
    
    // --- Testimonials Page ---
    testimonialsSlider: document.getElementById('testimonialsSlider'),
    
    // --- Global UI Elements ---
    // Loading spinner overlay.
    loader: document.querySelector('.loader')
};