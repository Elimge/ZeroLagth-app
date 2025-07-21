// js/dom.js
export const DOM = {
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
    appAll: document.getElementById('appAll'), 
    
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