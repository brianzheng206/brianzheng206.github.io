/**
 * Main JavaScript File
 * Handles general site functionality
 */

// Update copyright year
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Update resume date
    const resumeDateElement = document.getElementById('resumeDate');
    if (resumeDateElement) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const now = new Date();
        resumeDateElement.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.getElementById('navToggle').classList.remove('active');
                }
            }
        });
    });
});

// Image lazy loading fallback
document.addEventListener('DOMContentLoaded', function() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});

// Handle reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

// Intersection Observer for fade-in animations (if enabled)
if (!prefersReducedMotion.matches) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Collapsible experience timeline items
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        // Start collapsed by default
        item.classList.remove('expanded');
        
        // Add click handler
        item.addEventListener('click', function(e) {
            // Don't toggle if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            // Toggle expanded class
            this.classList.toggle('expanded');
        });
    });
});

// Position secondary timeline icon for multi-role timeline items
document.addEventListener('DOMContentLoaded', function() {
    function positionSecondaryIcon() {
        const secondaryIcon = document.querySelector('.timeline-icon-secondary');
        const coopRole = document.getElementById('coop-role');
        const timelineItem = document.querySelector('.timeline-item-multi');
        const timelineContent = timelineItem ? timelineItem.querySelector('.timeline-content') : null;
        const coopHeader = coopRole ? coopRole.querySelector('.timeline-header') : null;
        
        if (secondaryIcon && coopRole && timelineItem && coopHeader) {
            // Get the h3 element directly (the title we want to align with)
            const h3Element = coopHeader.querySelector('h3');
            
            if (h3Element) {
                // Get the absolute position of the h3 relative to the page
                const h3Rect = h3Element.getBoundingClientRect();
                const itemRect = timelineItem.getBoundingClientRect();
                
                // Calculate the offset from the timeline-item top to the h3 center
                const h3RelativeTop = h3Rect.top - itemRect.top;
                const h3Height = h3Rect.height;
                const iconHeight = secondaryIcon.offsetHeight;
                
                // Align icon center with h3 center
                const iconTop = h3RelativeTop + (h3Height / 2) - (iconHeight / 2);
                
                secondaryIcon.style.top = `${iconTop}px`;
            }
        }
    }
    
    // Position on load
    positionSecondaryIcon();
    
    // Reposition after a short delay to ensure layout is complete
    setTimeout(positionSecondaryIcon, 100);
    
    // Reposition on window resize and after expand/collapse
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(positionSecondaryIcon, 100);
    });
    
    // Reposition icon continuously during expand/collapse for instant sync
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const animationDuration = 500;
            const startTime = performance.now();
            let animationId;
            
            function updateIcon(currentTime) {
                const elapsed = currentTime - startTime;
                
                // Update icon position every frame
                positionSecondaryIcon();
                
                // Continue updating while animation is running
                if (elapsed < animationDuration) {
                    animationId = requestAnimationFrame(updateIcon);
                } else {
                    // Final update to ensure accuracy
                    positionSecondaryIcon();
                }
            }
            
            // Start updating immediately
            animationId = requestAnimationFrame(updateIcon);
        });
    });
});

