/**
 * @file testimonials.js
 * @description Manages the functionality of the testimonials page.
 * This includes loading mock testimonial data and rendering it in a simple slider/carousel.
 */

// Import dependencies.
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader } from '../ui.js';

/**
 * The index of the currently displayed testimonial in the state.testimonials array.
 * @type {number}
 * @private
 */
let currentTestimonialIndex = 0;

/**
 * Loads the testimonials data and renders the first one.
 * In this implementation, testimonials are hardcoded (mock data) for demonstration purposes.
 * @function loadTestimonials
 */
export function loadTestimonials() {
    showLoader();
    // Use a timeout to simulate a network request.
    setTimeout(() => {
        // Mock data for testimonials. In a real application, this would be fetched from an API.
        const mockTestimonials = [
            {
                id: 1,
                name: 'Laura Gómez',
                role: 'Tourist from Bogotá',
                image: 'https://image.shutterstock.com/image-photo/young-hispanic-girl-holding-colombia-260nw-2139014159.jpg',
                content: 'Visiting the Atlántico department was an incredible experience. The places are beautiful and the people are very friendly. I will definitely be back soon. I was surprised by the variety of activities available, from touring paradise beaches to exploring towns full of history and culture. Every day was a new adventure, and I learned a lot about local traditions.'
            },
            {
                id: 2,
                name: 'Pedro Martínez',
                role: 'International Traveler',
                image: 'https://definicion.de/wp-content/uploads/2008/05/hombre-1.jpg',
                content: 'The Totumo Volcano was a unique experience. The tour guides are very professional and know the region very well. Additionally, the hospitality of the locals made my visit even more special. I recommend all travelers include Atlántico in their itinerary, as it offers impressive landscapes and delicious cuisine.'
            },
            // ... more testimonials
        ];
        
        // Store the mock data in the global state.
        state.testimonials = mockTestimonials;
        
        // Render the initial testimonial.
        renderTestimonial(currentTestimonialIndex);
        
        hideLoader();
    }, 500);
}

/**
 * Renders a single testimonial into the slider container based on its index.
 * @param {number} index - The index of the testimonial to render from the state.testimonials array.
 * @private
 */
function renderTestimonial(index) {
    const testimonial = state.testimonials[index];
    if (!testimonial) return; // Guard clause in case the index is invalid.

    // Populate the slider element with the testimonial's data.
    DOM.testimonialsSlider.innerHTML = `
        <div class="testimonial">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-img">
            <p class="testimonial-content">"${testimonial.content}"</p>
            <h4 class="testimonial-author">${testimonial.name}</h4>
            <p class="testimonial-role">${testimonial.role}</p>
        </div>`;
}

/**
 * Displays the next testimonial in the list.
 * It loops back to the beginning if it reaches the end of the array.
 * This function is intended to be called by a 'next' button's event listener.
 * @function showNextTestimonial
 */
export function showNextTestimonial() {
    // Increment index and use the modulo operator to wrap around to the start.
    currentTestimonialIndex = (currentTestimonialIndex + 1) % state.testimonials.length;
    renderTestimonial(currentTestimonialIndex);
}

/**
 * Displays the previous testimonial in the list.
 * It loops back to the end if it's at the beginning of the array.
 * This function is intended to be called by a 'previous' button's event listener.
 * @function showPrevTestimonial
 */
export function showPrevTestimonial() {
    // Decrement index and add the array length to handle negative numbers before the modulo.
    currentTestimonialIndex = (currentTestimonialIndex - 1 + state.testimonials.length) % state.testimonials.length;
    renderTestimonial(currentTestimonialIndex);
}