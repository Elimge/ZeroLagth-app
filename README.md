# Q'rramba Tours - A Tourist Discovery SPA

This project is a feature-rich Single Page Application (SPA) designed to serve as a tourist discovery and route-planning platform. It's built from the ground up using modern vanilla JavaScript (ES6+), HTML5, and CSS, without relying on any external frameworks. The application features a complete client-side routing system, role-based authentication, a unique implementation of the Eisenhower Matrix for personalizing recommendations, and full CRUD (Create, Read, Update, Delete) functionality for managing tourist destinations.

### 🚀 **[Live Demo Here](https://elimge.github.io/ZeroLagth-app/)** 🚀

You can try the fully deployed application right in your browser at the following link:

**[https://elimge.github.io/ZeroLagth-app/](https://elimge.github.io/ZeroLagth-app/)**


## Features

This project implements a complete system with the following features:

*   **Role-Based Authentication & Security:**
    *   Separate registration and login flows for two distinct user roles: **Administrator** and **User**.
    *   Persistent sessions using `localStorage` to keep users logged in across browser reloads.
    *   **Protected Routes:** The custom-built router prevents access to the admin panel if the user is not an administrator.

*   **Personalized User Dashboard:**
    *   **Eisenhower Matrix for Discovery:** On the main dashboard, destinations are automatically categorized for the user based on their interests into four quadrants: "Your Preferences," "Related Places," "You Might Like," and "Other Places."
    *   **Interactive Destination Cards:** Users can view details, add places to their favorites, and explore what the region has to offer.
    *   **Detailed Modal View:** Clicking on a destination opens a rich modal with a full description, image gallery, and mock data for available guides and schedules.

*   **Custom Route Planner:**
    *   Users can build a personalized travel plan from their list of favorite destinations.
    *   By classifying each favorite spot as "Urgent" and/or "Important," the application generates a prioritized itinerary, suggesting what to do now, what to plan for later, and what could be skipped.

*   **Administrator Dashboard:**
    *   **Full CRUD Functionality:** Administrators have exclusive access to a panel where they can **Create, Read, Update, and Delete** destinations.
    *   **Dynamic & Intuitive Forms:** The interface for adding and editing destinations is managed through a single, reusable modal form.

*   **Modern & Modular Architecture:**
    *   **Client-Side Routing:** A custom router manages navigation between views, providing a smooth and fast user experience without page reloads.
    *   **State-Driven UI:** A central `state` object acts as the single source of truth, ensuring the UI is always a reflection of the current data.
    *   **Modular Codebase:** The project is organized with a clear separation of concerns, with distinct modules for API calls, authentication, DOM manipulation, routing, and page-specific logic.

## Tech Stack & Architecture

*   **Frontend:**
    *   **Vanilla JavaScript (ES6+):** Utilizes modern features like `async/await`, Modules (`import/export`), and Array methods.
    *   **HTML5 & CSS3:** For structure and a fully responsive, modern design.
    *   **No Build Tools or Frameworks:** The project runs directly in the browser without the need for tools like Vite, Webpack, or React.

*   **Data Source (Mock API):**
    *   **Static JSON File:** The application uses a local `db.json` file to simulate a RESTful API. Data is fetched using the native **Fetch API**. All CRUD operations performed in the admin panel modify the application's state in memory but do not write back to the `db.json` file.

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge).
*   A local web server to handle `fetch()` requests to a local file. The **Live Server** extension for Visual Studio Code is highly recommended.

### Installation & Setup

1.  **Clone the repository:**
```bash
    git clone https://github.com/Elimge/ZeroLagth-app.git
```
2.  **Navigate to the project directory:**
```bash
    cd zerolagth-app
```
3.  **Run the application:**
    *   If you have the **Live Server** extension in VS Code, right-click the `index.html` file and select "Open with Live Server".
    *   Otherwise, run any simple local web server from the root of the project folder.

4.  **Open the application:** Your browser will open to the local address provided by your server (e.g., `http://127.0.0.1:5500`).

### Credentials for Testing

You can use the following pre-configured users from `js/auth.js` to test the application:

| Role          | Email              | Password   |
|---------------|--------------------|------------|
| Administrator | `admin@example.com`| `admin123` |
| User          | `user@example.com` | `user123`  |

You can also register new "user" accounts through the registration page.

## File Structure
```bash
    /zerolagth-app
│
├── .gitignore
├── index.html
├── main.js
├── styles.css
├── LICENSE
├── README.md
│
├── databases/
│   └── db.json
│
└── js/
    ├── api.js
    ├── auth.js
    ├── dom.js
    ├── events.js
    ├── main.js
    ├── router.js
    ├── state.js
    ├── ui.js
    │
    └── pages/
        ├── admin.js
        ├── dashboard.js
        ├── favorites.js
        ├── routePlanner.js
        └── testimonials.js
```

## Author

*   **Zero Lagth INC**
*   **URL:** https://elimge.github.io/ZeroLagth-app/