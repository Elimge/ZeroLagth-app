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
        logoutButton: document.getElementById('logout-button'), 
        q1: document.getElementById('q1'),
        q2: document.getElementById('q2'),
        q3: document.getElementById('q3'),
        q4: document.getElementById('q4'),
        focusOverlay: document.getElementById('focus-overlay'),
        focusTaskName: document.getElementById('focus-task-name'),
        focusTimer: document.getElementById('focus-timer')
    };

    function showFocusMode(taskName) {
        DOM.focusTaskName.textContent = taskName;
        DOM.focusOverlay.style.display = 'flex'; // Usamos flex para centrar
    }

    function hideFocusMode() {
        DOM.focusOverlay.style.display = 'none';
    }

    function updateTimerDisplay(timeString) {
        DOM.focusTimer.textContent = timeString;
    }

    function renderTasks() {
        // 1. Limpiar todos los cuadrantes para evitar duplicados
        DOM.q1.innerHTML = '<h2>Hacer Ahora (Urgente / Importante)</h2>';
        DOM.q2.innerHTML = '<h2>Planificar (Importante / No Urgente)</h2>';
        DOM.q3.innerHTML = '<h2>Delegar (Urgente / No Importante)</h2>';
        DOM.q4.innerHTML = '<h2>Eliminar (No Urgente / No Importante)</h2>';

        // 2. Iterar sobre las tareas del Estado y dibujarlas
        State.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task'); // Añadimos una clase para estilos
            taskElement.textContent = task.text;
            taskElement.dataset.id = task.id; // Guardamos el ID en el elemento

            if (task.quadrant === 'q1') {
                const focusButton = document.createElement('button');
                focusButton.classList.add('focus-btn');
                focusButton.textContent = '▶️ Iniciar Foco';
                focusButton.dataset.taskId = task.id; // Vinculamos el botón a la tarea
                taskElement.appendChild(focusButton);
            }
            // Añadimos la tarea al cuadrante correcto
            DOM[task.quadrant].appendChild(taskElement);
        });
    }

    // Función pública que redibuja la app basándose en el Estado
    function render() {
        if (State.currentUser) {
            DOM.loginScreen.style.display = 'none';
            DOM.appScreen.style.display = 'block';
            DOM.welcomeMessage.textContent = `Dashboard de ${State.currentUser}`;
            renderTasks();
        } else {
            DOM.loginScreen.style.display = 'block';
            DOM.appScreen.style.display = 'none';
        }
        // Próximamente: aquí se renderizarán las tareas...
    }

    // Exponemos solo las funciones que otros módulos necesitan
    return {
        render: render,
        DOM: DOM, 
        showFocusMode: showFocusMode,
        hideFocusMode: hideFocusMode,
        updateTimerDisplay: updateTimerDisplay // <-- AÑADIR
    };
})();

// --- MÓDULO AUTH ---
// Responsable de la lógica de login y logout.
const AuthModule = (function() {
    function login(username) {
        // Lógica de negocio: modificar el Estado
        State.currentUser = username;
        localStorage.setItem('currentUser', username);
        TasksModule.loadTasks();
    }

    function logout() {
        // Lógica de negocio: modificar el Estado
        State.currentUser = null;
        localStorage.removeItem('currentUser');
        State.tasks = [];
    }

    function checkCurrentUser() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            // Si encontramos un usuario, lo ponemos en el Estado
            State.currentUser = user;
            TasksModule.loadTasks();
        }
    }
    
    return {
        login: login,
        logout: logout,
        checkCurrentUser: checkCurrentUser
        // ¡Se han eliminado las líneas incorrectas!
    };
})();

// --- MÓDULO TASKS ---
// Responsable de la lógica de añadir, clasificar y guardar tareas.
const TasksModule = (function() {
    function addTask(text) {
        // 1. Hacer las preguntas de Eisenhower
        const isUrgent = confirm("¿Esta tarea es URGENTE?");
        const isImportant = confirm("¿Esta tarea es IMPORTANTE?");

        // 2. Determinar el cuadrante
        let quadrant;
        if (isUrgent && isImportant) quadrant = 'q1';
        else if (!isUrgent && isImportant) quadrant = 'q2';
        else if (isUrgent && !isImportant) quadrant = 'q3';
        else quadrant = 'q4';

        // 3. Crear el objeto de la tarea
        const newTask = {
            id: Date.now(), // ID único basado en el tiempo
            text: text,
            quadrant: quadrant
        };

        // 4. Modificar el Estado
        State.tasks.push(newTask);
        
        // 5. Guardar en localStorage
        saveTasks();
    }

    function saveTasks() {
        // Guardamos las tareas bajo el nombre del usuario actual
        localStorage.setItem(`tasks_${State.currentUser}`, JSON.stringify(State.tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem(`tasks_${State.currentUser}`);
        if (savedTasks) {
            State.tasks = JSON.parse(savedTasks);
        } else {
            State.tasks = []; // Asegurarse de que esté vacío si no hay nada guardado
        }
    }

    // (Próximamente añadiremos la función para cargar tareas)

    return {
        addTask: addTask,
        loadTasks: loadTasks 
    };
})();

// --- MÓDULO NOTIFICATIONS ---
    const NotificationsModule = (function() {
        function requestPermission() {
            if (!("Notification" in window)) return;
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        }
        function show(title, body) {
            if (Notification.permission === "granted") {
                new Notification(title, { body: body });
            }
        }
        return { requestPermission, show };
    })();

    // --- MÓDULO FOCUS ---
    let timerInterval = null;
    // const FOCUS_TIME = 25 * 60; // 25 minutos
    const FOCUS_TIME_SECONDS = 5; // Para pruebas rápidas. Cambiar a 25 * 60 para la versión final.

    const FocusModule = (function() {
        function startFocus(taskId) {
            const task = State.tasks.find(t => t.id === taskId);
            if (!task) return;

            // Detener cualquier temporizador anterior
            if (timerInterval) clearInterval(timerInterval);

            // Pedir permiso de notificaciones al iniciar el primer foco
            NotificationsModule.requestPermission();

            UIModule.showFocusMode(task.text);

            let timeLeft = FOCUS_TIME_SECONDS;

            // 2. Iniciar el temporizador
            timerInterval = setInterval(() => {
                timeLeft--;

                // Actualizar la UI del temporizador
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                UIModule.updateTimerDisplay(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

                // 3. Cuando el tiempo termina
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    UIModule.hideFocusMode();
                    NotificationsModule.show("¡Foco Completado!", `¡Buen trabajo con "${task.text}"!`);
                
                // Opcional: Marcar la tarea como completada o añadir un sonido
                }
            }, 1000);
        }

        return { startFocus };
    })();
            
    
// --- MÓDULO APP (ORQUESTADOR) ---
// Responsable de inicializar la app y conectar los otros módulos.
const AppModule = (function() {
    function setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        const logoutButton = UIModule.DOM.logoutButton;
        const taskForm = document.getElementById('task-form');
        const matrix = document.getElementById('eisenhower-matrix');

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
        
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskInput = document.getElementById('task-input');
            const taskText = taskInput.value;

            if (taskText) {
                TasksModule.addTask(taskText); // Llama a la lógica de negocio
                UIModule.render();             // Redibuja la pantalla
                taskInput.value = '';
            }
        });

            
        matrix.addEventListener('click', (e) => {
            if (e.target.classList.contains('focus-btn')) {
                const taskId = parseInt(e.target.dataset.taskId);
                FocusModule.startFocus(taskId);
            }
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