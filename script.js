// =================================
// 1. ESTADO CENTRALIZADO
// La única fuente de la verdad para toda la aplicación.
// =================================
const State = {
    currentUser: null,
    tasks: []
};

// =================================
// 2. MÓDULOS
// Cada módulo tiene una responsabilidad única.
// =================================

// --- MÓDULO UI ---
// Responsable de TODA la manipulación del DOM. No contiene lógica de negocio.
const UIModule = (function() {
    // Referencias a elementos del DOM
    const DOM = {
        loginScreen: document.getElementById('login-screen'),
        appScreen: document.getElementById('app-screen'),
        welcomeMessage: document.getElementById('welcome-message'),
        logoutButton: document.getElementById('logout-button') 
    };

    // Función pública que redibuja la app basándose en el Estado
    function render() {
        if (State.currentUser) {
            DOM.loginScreen.style.display = 'none';
            DOM.appScreen.style.display = 'block';
            DOM.welcomeMessage.textContent = `Dashboard de ${State.currentUser}`;
        } else {
            DOM.loginScreen.style.display = 'block';
            DOM.appScreen.style.display = 'none';
        }
        // Próximamente: aquí se renderizarán las tareas...
    }

    // Exponemos solo las funciones que otros módulos necesitan
    return {
        render: render,
        DOM: DOM // Exponemos DOM para que AppModule pueda añadir event listeners
    };
})();

// --- MÓDULO AUTH ---
// Responsable de la lógica de login y logout.
const AuthModule = (function() {
    function login(username) {
        // Lógica de negocio: modificar el Estado
        State.currentUser = username;
        localStorage.setItem('currentUser', username);
    }

    function logout() {
        // Lógica de negocio: modificar el Estado
        State.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    function checkCurrentUser() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            // Si encontramos un usuario, lo ponemos en el Estado
            State.currentUser = user;
        }
    }
    
    return {
        login: login,
        logout: logout,
        checkCurrentUser: checkCurrentUser
    };
})();


// --- MÓDULO APP (ORQUESTADOR) ---
// Responsable de inicializar la app y conectar los otros módulos.
const AppModule = (function() {
    function setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        const logoutButton = UIModule.DOM.logoutButton;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username-input');
            AuthModule.login(usernameInput.value);
            // Después de cambiar el estado, siempre redibujamos
            UIModule.render();
            usernameInput.value = '';
        });

        logoutButton.addEventListener('click', () => {
            AuthModule.logout(); // Llama a la lógica de negocio
            UIModule.render();   // Redibuja la pantalla
        });
        
        // (Aquí irán más event listeners en el futuro)
    }

    function init() {
        console.log("App iniciada.");
        AuthModule.checkCurrentUser();
        setupEventListeners();
        UIModule.render(); // Realizamos el primer renderizado
    }

    return {
        init: init
    };
})();


// =================================
// 3. INICIO DE LA APLICACIÓN
// =================================
AppModule.init();