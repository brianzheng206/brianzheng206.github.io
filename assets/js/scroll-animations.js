// Scroll animations setup using AOS (Animate On Scroll)
(function () {
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setAOSAttributes(selector, animation, opts) {
    const els = document.querySelectorAll(selector);
    els.forEach((el, i) => {
      if (!el.dataset.aos) el.dataset.aos = animation;
      if (opts && opts.anchorPlacement && !el.dataset.aosAnchorPlacement) el.dataset.aosAnchorPlacement = opts.anchorPlacement;
      if (opts && typeof opts.offset === 'number' && !el.dataset.aosOffset) el.dataset.aosOffset = String(opts.offset);
      if (opts && typeof opts.duration === 'number' && !el.dataset.aosDuration) el.dataset.aosDuration = String(opts.duration);
      if (opts && typeof opts.delayBase === 'number') {
        const delay = Math.min((opts.delayBase || 0) + (opts.stagger || 50) * i, 600);
        el.dataset.aosDelay = String(delay);
      }
      if (opts && opts.easing && !el.dataset.aosEasing) el.dataset.aosEasing = opts.easing;
      // Allow per-element overrides for once/mirror to prevent replays after modal close
      if (opts && typeof opts.once === 'boolean' && el.dataset.aosOnce == null) el.dataset.aosOnce = String(opts.once);
      if (opts && typeof opts.mirror === 'boolean' && el.dataset.aosMirror == null) el.dataset.aosMirror = String(opts.mirror);
    });
  }

  function initAOS() {
    // Assign animations to common elements across the site
    setAOSAttributes('.section-title', 'fade-up', { duration: 700, offset: 120 });
    setAOSAttributes('.section-subtitle', 'fade-up', { duration: 700, offset: 120, delayBase: 100 });

    // Projects: animate on first reveal only; prevent replay after closing modal
    // Don't animate the container - let individual buttons create the wave effect
    setAOSAttributes('.filter-btn', 'fade-up', { duration: 600, offset: 120, delayBase: 50, stagger: 50 });
    // Avoid animating the container itself to prevent layout jitters
    // Use fade-up (no scale) to avoid visible width change from zoom
    setAOSAttributes('.project-card', 'fade-up', { duration: 700, offset: 140, delayBase: 50, stagger: 70, anchorPlacement: 'top-bottom' });
    // Custom slider + arrows for horizontal scroll
    setAOSAttributes('.carousel-slider-container', 'fade', { duration: 700, offset: 140, anchorPlacement: 'top-bottom' });
    setAOSAttributes('.carousel-arrow', 'fade-up', { duration: 600, offset: 140, delayBase: 50, stagger: 50, anchorPlacement: 'top-bottom' });

    // Experience timeline - varied animations
    setAOSAttributes('.experience-timeline', 'fade-right', { duration: 700, offset: 160 });
    setAOSAttributes('.timeline-item', 'fade-left', { duration: 700, offset: 140, delayBase: 50, stagger: 80 });

    // Skills - keep zoom-in for cards, add fade for container
    setAOSAttributes('.skills-container', 'fade-up', { duration: 700, offset: 140 });
    setAOSAttributes('.skill-category-card', 'zoom-in', { duration: 600, offset: 120, delayBase: 50, stagger: 60 });

    // Blog and awards - varied animations
    setAOSAttributes('.blog-card', 'fade-right', { duration: 700, offset: 140, delayBase: 80, stagger: 80 });
    setAOSAttributes('.awards-section h3', 'fade-up', { duration: 700, offset: 120 });
    setAOSAttributes('.award-card', 'zoom-in', { duration: 600, offset: 120, delayBase: 60, stagger: 60 });

    // About workspace slideshow
    setAOSAttributes('#aboutWorkspaceSlideshow', 'fade-up', { duration: 800, offset: 160 });

    // Initialize AOS
    AOS.init({
      duration: 700,
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
      once: false,      // replay when re-entering viewport
      mirror: true,     // animate out on scroll past to allow re-trigger
      offset: 100,
      // Disable if user prefers reduced motion
      disable: function () { return prefersReducedMotion(); }
    });

    // Ensure AOS picks up dynamically assigned attributes and correct positions
    try {
      if (window.AOS && typeof window.AOS.refreshHard === 'function') {
        window.AOS.refreshHard();
      } else if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
      }
      // Run one more time after layout settles
      setTimeout(() => {
        try { window.AOS && window.AOS.refreshHard && window.AOS.refreshHard(); } catch (_) {}
      }, 60);
    } catch (_) {}

    // Gate filter button replays: only replay after the entire section was out of view
    const projectsSection = document.getElementById('projects');
    if (projectsSection && 'IntersectionObserver' in window) {
      let sectionWasOut = false;
      let buttonsAnimatedOnce = false;

      // After the buttons animate once initially, enable gating to prevent repeated partial replays
      document.addEventListener('aos:in', function (evt) {
        const el = (evt && (evt.detail || evt.target)) || null;
        if (!buttonsAnimatedOnce && el && el.classList && el.classList.contains('filter-btn')) {
          buttonsAnimatedOnce = true;
          document.body.classList.add('aos-buttons-gated');
        }
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            sectionWasOut = true; // Entire section left viewport
          } else if (sectionWasOut) {
            // Section re-entered after being fully out; temporarily allow button animations
            document.body.classList.remove('aos-buttons-gated');
            // Refresh to ensure AOS recalculates and can animate
            try { window.AOS && window.AOS.refresh(); } catch (_) {}
            // Re-enable gating after animation window
            setTimeout(() => {
              document.body.classList.add('aos-buttons-gated');
              sectionWasOut = false;
            }, 1200); // cover stagger + duration window
          }
        });
      }, { threshold: [0] });
      io.observe(projectsSection);
    }
  }

  // Wait for page load so sizes are known for offsets
  if (document.readyState === 'complete') initAOS();
  else window.addEventListener('load', initAOS);
})();
