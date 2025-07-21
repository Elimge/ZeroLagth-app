// js/pages/testimonials.js
import { state } from '../state.js';
import { DOM } from '../dom.js';
import { showLoader, hideLoader } from '../ui.js';

let currentTestimonialIndex = 0;

export function loadTestimonials() {
    showLoader();
    setTimeout(() => {
        const mockTestimonials = [
            {
            id: 1,
            name: 'Laura Gómez',
            role: 'Turista de Bogotá',
            image: 'https://image.shutterstock.com/image-photo/young-hispanic-girl-holding-colombia-260nw-2139014159.jpg',
            content: 'Visitar el Atlántico fue una experiencia increíble. Los lugares son hermosos y la gente muy amable. Definitivamente volveré pronto. Me sorprendió la variedad de actividades que se pueden realizar, desde recorrer playas paradisíacas hasta explorar pueblos llenos de historia y cultura. Cada día fue una nueva aventura y aprendí mucho sobre las tradiciones locales.'
            },
            {
            id: 2,
            name: 'Pedro Martínez',
            role: 'Viajero Internacional',
            image: 'https://definicion.de/wp-content/uploads/2008/05/hombre-1.jpg',
            content: 'El Volcán del Totumo fue una experiencia única. Los guías turísticos son muy profesionales y conocen muy bien la región. Además, la hospitalidad de los habitantes hizo que mi visita fuera aún más especial. Recomiendo a todos los viajeros incluir el Atlántico en su itinerario, ya que ofrece paisajes impresionantes y una gastronomía deliciosa.'
            },
            {
            id: 3,
            name: 'Ana Rodríguez',
            role: 'Fotógrafa de Viajes',
            image: 'https://sd-hegemone-production.sdcdns.com/dictionary-images/600/6fa87ce6-25e8-4c27-887a-2d2eaece0590.jpg',
            content: 'La diversidad cultural del Atlántico es impresionante. Pude capturar imágenes increíbles de sus paisajes y tradiciones. Cada rincón tiene una historia que contar y la calidez de la gente se refleja en cada fotografía. Sin duda, es un destino que inspira y motiva a seguir explorando.'
            },
            {
            id: 4,
            name: 'Carlos Pérez',
            role: 'Empresario',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            content: 'La gastronomía del Atlántico es deliciosa. Recomiendo probar los platos típicos y disfrutar de la calidez de su gente. Los restaurantes y mercados locales ofrecen una variedad de sabores que reflejan la riqueza cultural de la región. Fue una experiencia culinaria que superó mis expectativas.'
            },
            {
            id: 5,
            name: 'María Fernanda Ruiz',
            role: 'Estudiante Universitaria',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            content: 'Aprendí mucho sobre la historia y cultura de la región. Los museos y sitios históricos son fascinantes. Participé en recorridos guiados que me permitieron comprender mejor el pasado del Atlántico y su importancia en el país. Recomiendo esta experiencia a quienes buscan aprender y disfrutar al mismo tiempo.'
            },
            {
            id: 6,
            name: 'Jorge Castillo',
            role: 'Aventurero',
            image: 'https://randomuser.me/api/portraits/men/65.jpg',
            content: 'Las playas del Atlántico son perfectas para relajarse y practicar deportes acuáticos. ¡Una experiencia inolvidable! Además, la oferta de actividades de aventura es muy amplia, desde surf hasta senderismo. Sin duda, es un destino ideal para quienes buscan emociones y contacto con la naturaleza.'
            },
            {
            id: 7,
            name: 'Sofía Morales',
            role: 'Bloguera de Viajes',
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            content: 'Me encantó compartir mis aventuras en el Atlántico con mis seguidores. Hay tanto por descubrir y disfrutar en esta región. Cada día encontraba algo nuevo que contar, desde festivales coloridos hasta rincones tranquilos para descansar. El Atlántico es un destino que recomiendo a todos los amantes de los viajes.'
            },
        ];
        state.testimonials = mockTestimonials;
        renderTestimonial(currentTestimonialIndex);
        hideLoader();
    }, 500);
}

function renderTestimonial(index) {
    const testimonial = state.testimonials[index];
    if (!testimonial) return;
    DOM.testimonialsSlider.innerHTML = `
        <div class="testimonial">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-img">
            <p class="testimonial-content">"${testimonial.content}"</p>
            <h4 class="testimonial-author">${testimonial.name}</h4>
            <p class="testimonial-role">${testimonial.role}</p>
        </div>`;
}

export function showNextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % state.testimonials.length;
    renderTestimonial(currentTestimonialIndex);
}

export function showPrevTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + state.testimonials.length) % state.testimonials.length;
    renderTestimonial(currentTestimonialIndex);
}