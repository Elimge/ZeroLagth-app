// js/api.js
export async function fetchDestinations() {
    try {
        const response = await fetch('./databases/db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not load destinations:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}