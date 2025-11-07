/**
 * Projects JavaScript
 * Handles project filtering and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsCarousel = document.getElementById('projectsGrid');
    const carouselLeft = document.getElementById('carouselLeft');
    const carouselRight = document.getElementById('carouselRight');
    
    // Carousel navigation
    let updateArrowStates = null;
    
    if (projectsCarousel && carouselLeft && carouselRight) {
        const scrollAmount = 500; // Pixels to scroll per click
        
        // Update arrow states and slider based on scroll position
        updateArrowStates = () => {
            const { scrollLeft, scrollWidth, clientWidth } = projectsCarousel;
            const maxScroll = scrollWidth - clientWidth;
            const scrollPercentage = maxScroll > 0 ? (scrollLeft / maxScroll) : 0;
            
            // Disable left arrow if at the start
            if (scrollLeft <= 0) {
                carouselLeft.disabled = true;
            } else {
                carouselLeft.disabled = false;
            }
            
            // Disable right arrow if at the end
            if (scrollLeft >= maxScroll - 10) {
                carouselRight.disabled = true;
            } else {
                carouselRight.disabled = false;
            }
            
            // Update slider thumb position
            const sliderThumb = document.getElementById('carouselSliderThumb');
            const sliderTrack = document.querySelector('.carousel-slider-track');
            if (sliderThumb && sliderTrack) {
                const trackWidth = sliderTrack.offsetWidth;
                const thumbWidth = Math.max(20, trackWidth * (clientWidth / scrollWidth));
                const maxLeft = trackWidth - thumbWidth;
                sliderThumb.style.width = thumbWidth + 'px';
                sliderThumb.style.left = (scrollPercentage * maxLeft) + 'px';
            }
        };
        
        // Scroll left
        carouselLeft.addEventListener('click', () => {
            projectsCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Scroll right
        carouselRight.addEventListener('click', () => {
            projectsCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update arrow states on scroll
        projectsCarousel.addEventListener('scroll', updateArrowStates);
        
        // Mouse wheel scrolling for horizontal scroll
        projectsCarousel.addEventListener('wheel', (e) => {
            // Prevent default vertical scrolling
            e.preventDefault();
            
            // Scroll horizontally based on vertical wheel delta
            const scrollAmount = e.deltaY;
            projectsCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'auto' // Use 'auto' for immediate response to wheel
            });
        }, { passive: false });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let isScrolling = false;
        
        projectsCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        projectsCarousel.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = touchStartX - touchX;
            const diffY = touchStartY - touchY;
            
            // Determine if horizontal or vertical scroll
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal scroll
                isScrolling = true;
                projectsCarousel.scrollLeft += diffX;
                touchStartX = touchX;
                touchStartY = touchY;
            }
        }, { passive: true });
        
        projectsCarousel.addEventListener('touchend', () => {
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
        
        // Slider click to scroll
        const sliderTrack = document.querySelector('.carousel-slider-track');
        if (sliderTrack) {
            sliderTrack.addEventListener('click', (e) => {
                const rect = sliderTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                const maxScroll = projectsCarousel.scrollWidth - projectsCarousel.clientWidth;
                projectsCarousel.scrollTo({
                    left: percentage * maxScroll,
                    behavior: 'smooth'
                });
            });
        }
        
        // Initial state
        updateArrowStates();
        
        // Update on window resize
        window.addEventListener('resize', updateArrowStates);
    }
    
    // Project filtering functionality
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category.includes(filter)) {
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        // Fade in animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        // Fade out animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Update arrow states after filtering
                if (projectsCarousel) {
                    setTimeout(() => {
                        const updateArrowStates = () => {
                            const { scrollLeft, scrollWidth, clientWidth } = projectsCarousel;
                            if (carouselLeft) {
                                carouselLeft.disabled = scrollLeft <= 0;
                            }
                            if (carouselRight) {
                                carouselRight.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
                            }
                        };
                        updateArrowStates();
                    }, 350);
                }
            });
        });
    }
    
    // Initialize project card styles for smooth transitions
    projectCards.forEach((card, index) => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Project card modal popup functionality
    let currentModal = null;
    
    // Create modal overlay structure
    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'project-modal-overlay';
        overlay.innerHTML = `
            <div class="project-modal-content">
                <button class="project-modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }
    
    // Open modal with project card content
    function openProjectModal(card) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.project-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create new modal overlay
        const modalOverlay = createModal();
        const modalContent = modalOverlay.querySelector('.project-modal-content');
        const closeBtn = modalOverlay.querySelector('.project-modal-close');
        
        // Clone the card content
        const cardClone = card.cloneNode(true);
        cardClone.style.width = '100%';
        cardClone.style.maxWidth = 'none';
        cardClone.style.cursor = 'default';
        
        // Add cloned card to modal (close button is already in modalContent)
        modalContent.appendChild(cardClone);
        
        // Trigger animation with a small delay to ensure DOM is ready
        setTimeout(() => {
            requestAnimationFrame(() => {
                modalOverlay.classList.add('active');
            });
        }, 10);
        
        currentModal = modalOverlay;
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Close button handler
        closeBtn.addEventListener('click', closeProjectModal);
        
        // Close on backdrop click
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeProjectModal();
            }
        });
        
        // Close on Escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape' && currentModal) {
                closeProjectModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Close modal
    function closeProjectModal() {
        if (currentModal) {
            currentModal.classList.remove('active');
            setTimeout(() => {
                if (currentModal && currentModal.parentNode) {
                    currentModal.parentNode.removeChild(currentModal);
                }
                currentModal = null;
                document.body.style.overflow = '';
            }, 500); // Wait for animation to complete (increased for smoother exit)
        }
    }
    
    // Add click handlers to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on links
            if (e.target.closest('.project-link') || e.target.closest('.project-overlay')) {
                return;
            }
            
            // Open modal with this card's content
            openProjectModal(card);
        });
    });
    
    // Lazy load project images
    const projectImages = document.querySelectorAll('.project-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        projectImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

