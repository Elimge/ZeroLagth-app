/**
 * @file api.js
 * @description This module handles all interactions with the mock API (db.json).
 * It is responsible for fetching data required by the application.
 */

/**
 * Fetches the list of tourist destinations from the local JSON database file.
 * This function simulates a GET request to an API endpoint. In case of a network
 * or parsing error, it logs the issue and returns an empty array to ensure
 * the application remains stable.
 *
 * @async
 * @function fetchDestinations
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of destination objects.
 * If the fetch operation fails, it gracefully returns an empty array.
 */
export async function fetchDestinations() {
    try {
        // Attempt to fetch data from the local db.json file.
        const response = await fetch('./databases/db.json');

        // Check if the HTTP response status is not OK (e.g., 404 Not Found).
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data from the response body and return it.
        return await response.json();
    } catch (error) {
        // Log any errors that occur during the fetch or parsing process.
        console.error("Could not load destinations:", error);
        
        // Return an empty array as a safe fallback to prevent the app from crashing.
        return [];
    }
}