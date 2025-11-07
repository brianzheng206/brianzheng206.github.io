/**
 * Projects JavaScript
 * Handles project filtering and animations
 */

// Persist last-known positions for every card across filter changes
const prevRects = new WeakMap();
// Guard for stale / aborted runs
let activeRunId = 0;
let latestFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsCarousel = document.getElementById('projectsGrid');
    const carouselLeft = document.getElementById('carouselLeft');
    const carouselRight = document.getElementById('carouselRight');
    
    // Carousel navigation
    let updateArrowStates = null; // Declare at outer scope for filter code access
    
    if (projectsCarousel && carouselLeft && carouselRight) {
        const scrollAmount = 500; // Pixels to scroll per click
        
        // --- Define updateArrowStates once at top of block ---
        // Update position synchronously but keep visual animations
        updateArrowStates = () => {
            const { scrollLeft, scrollWidth, clientWidth } = projectsCarousel;
            const maxScroll = scrollWidth - clientWidth;
            
            // Left/Right button enablement
            const atStart = scrollLeft <= 0;
            const atEnd = scrollLeft >= maxScroll - 1;
            
            carouselLeft.disabled = atStart;
            carouselRight.disabled = atEnd;
            carouselLeft.classList.toggle('disabled', atStart);
            carouselRight.classList.toggle('disabled', atEnd);
            
            // Slider thumb (if present) - update position immediately, keep visual animations
            const sliderThumb = document.getElementById('carouselSliderThumb');
            const sliderTrack = document.querySelector('.carousel-slider-track');
            if (sliderThumb && sliderTrack) {
                const trackWidth = sliderTrack.offsetWidth;
                const thumbWidth = Math.max(20, trackWidth * (clientWidth / scrollWidth));
                const maxLeft = trackWidth - thumbWidth;
                const scrollPct = maxScroll > 0 ? scrollLeft / maxScroll : 0;
                const newLeft = scrollPct * maxLeft;
                
                // Update position immediately for perfect sync (CSS transitions handle smoothness)
                sliderThumb.style.width = thumbWidth + 'px';
                sliderThumb.style.setProperty('--thumb-x', `${newLeft}px`);
                sliderThumb.style.transform = `translateX(${newLeft}px)`;
                
                // Add active state for visual feedback (glow effect)
                sliderThumb.classList.add('active');
                clearTimeout(sliderThumb.activeTimeout);
                sliderThumb.activeTimeout = setTimeout(() => {
                    sliderThumb.classList.remove('active');
                }, 200);
            }
        };
        
        // Scroll left - instant with smooth native scrolling
        carouselLeft.addEventListener('click', () => {
            projectsCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Scroll right - instant with smooth native scrolling
        carouselRight.addEventListener('click', () => {
            projectsCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // --- wheel → horizontal while hovering ---
        projectsCarousel.addEventListener('wheel', (e) => {
            // If user is performing a pinch/zoom gesture or holding Ctrl, let the page handle it
            if (e.ctrlKey) return;
            
            const { deltaX, deltaY } = e;
            
            // Prefer vertical deltas from mouse wheels/trackpads; fall back to deltaX if the device already scrolls sideways.
            const intended = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
            if (intended === 0) return;
            
            const el = projectsCarousel;
            const maxScroll = el.scrollWidth - el.clientWidth;
            const atStart = el.scrollLeft <= 0;
            const atEnd = el.scrollLeft >= maxScroll - 1;
            
            // Determine scroll direction (+ = right, - = left)
            const dir = Math.sign(intended);
            
            // If we can scroll in that direction, consume the wheel and move horizontally.
            const canScrollRight = dir > 0 && !atEnd;
            const canScrollLeft  = dir < 0 && !atStart;
            
            if (canScrollLeft || canScrollRight) {
                e.preventDefault();               // stop the page from scrolling vertically
                el.scrollBy({
                    left: intended,               // natural-feel: use the raw delta
                    behavior: 'auto'              // 'smooth' feels laggy with continuous wheel; keep it snappy
                });
                updateArrowStates();
            }
            // else: at an edge → allow the event to bubble so the page can scroll normally
        }, { passive: false });
        
        // Also keep arrow-state in sync
        projectsCarousel.addEventListener('scroll', updateArrowStates);
        window.addEventListener('resize', updateArrowStates);
        
        // Optional: keyboard left/right while focused
        projectsCarousel.setAttribute('tabindex', '0');
        projectsCarousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const step = e.key === 'ArrowRight' ? 300 : -300;
                projectsCarousel.scrollBy({ left: step, behavior: 'smooth' });
                e.preventDefault();
            }
        });
        
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
    
    // Helpers for robust filtering and visibility
    function parseCategories(card) {
        const raw = (card.getAttribute('data-category') || '').toLowerCase();
        return new Set(raw.split(/[\s,|]+/).map(s => s.trim()).filter(Boolean));
    }

    function matchesFilter(card, filter) {
        if (!filter || filter === 'all') return true;
        return parseCategories(card).has(filter.toLowerCase());
    }

    function isActuallyVisible(card) {
        const cs = getComputedStyle(card);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && card.offsetWidth > 0 && card.offsetHeight > 0;
    }

    // Project filtering functionality (WAAPI-based FLIP animation)
    if (filterButtons.length > 0 && projectCards.length > 0) {
        const grid = projectsCarousel || document.querySelector('.projects-carousel') || document.querySelector('.projects-grid');
        
        // Respect prefers-reduced-motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Snappy but smooth timings
        const DURATION = prefersReduced ? 1 : 480;       // FLIP motion (slower, more elegant)
        const DURATION_ENTER = prefersReduced ? 1 : 950; // fade-in with slide (smooth, elegant, slower)
        const DURATION_EXIT = prefersReduced ? 1 : 200;  // exit
        const EASE_SPRING = 'cubic-bezier(0.22, 1, 0.36, 1)';        // for FLIP
        const EASE_SOFT_OUT = 'cubic-bezier(0.33, 1, 0.68, 1)';   // smooth ease-out for fade-in

        // Temporarily disable scroll snapping/behavior during filter animations
        function suspendScrollSnap(container) {
            if (!container) return () => {};
            container.classList.add('is-filtering');
            container.style.pointerEvents = 'none';
            container.style.scrollSnapType = 'none';
            container.style.scrollBehavior = 'auto';
            return () => {
                container.classList.remove('is-filtering');
                container.style.pointerEvents = '';
                container.style.scrollSnapType = '';
                container.style.scrollBehavior = '';
            };
        }
        
        // Helper: cancel all animations on a set of elements
        function cancelAll(cardSet) {
            cardSet.forEach(card => {
                const anims = [...card.getAnimations({ subtree: false })];
                anims.forEach(a => {
                    try { a.cancel(); } catch(_) {}
                });
            });
        }
        
        // Helper: run FLIP for a set of elements from rectA -> rectB
        function flipAnimate(el, fromRect, toRect, options = {}) {
            // Use precise deltas and pre-set transform to avoid a one-frame flash
            const dx = (fromRect.left - toRect.left);
            const dy = (fromRect.top - toRect.top);
            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
            const scaleX = clamp(fromRect.width / toRect.width || 1, 0.5, 2);
            const scaleY = clamp(fromRect.height / toRect.height || 1, 0.5, 2);
            
            // If virtually no movement AND no scale change, skip (but allow small movements for smoothness)
            // This ensures entering cards with synthesized offsets always animate
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(scaleX - 1) < 0.001 && Math.abs(scaleY - 1) < 0.001) {
                return Promise.resolve();
            }
            
            // Cancel any previous animations on this element
            el.getAnimations({ subtree: false }).forEach(a => a.cancel());
            // Pre-set transform so the element visually stays put when layout has changed
            el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})`;
            
            const animation = el.animate([
                { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})` },
                { transform: 'translate3d(0, 0, 0) scale(1, 1)' }
            ], {
                duration: options.duration ?? DURATION,
                easing: options.easing ?? EASE_SPRING,
                fill: 'both',
                composite: 'replace'
            });
            
            return animation.finished.catch(() => {}); // guard if canceled
        }
        
        // Helper: finalize state and refresh cache for all cards
        function finalizeStateAndRefreshCache(grid, visibleFilter, runId) {
            // Do nothing if this run is stale
            if (runId != null && runId !== activeRunId) return;
            // Cancel all animations first
            cancelAll(projectCards);
            
            projectCards.forEach(card => {
                // Determine visibility by current filter
                const shouldShow = matchesFilter(card, visibleFilter);
                
                if (shouldShow) {
                    // Hard-set display and flexDirection so cards maintain proper size
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.visibility = 'visible';
                } else {
                    card.style.display = 'none';
                }
                
                // Clear all transient styles used during transitions
                card.style.opacity = '';
                card.style.transform = '';
                card.style.willChange = '';
                card.style.width = '';
                card.style.marginRight = '';
                card.style.marginLeft = '';
                card.style.overflow = '';
                card.style.pointerEvents = '';
                card.classList.remove('is-exiting');
                
                // Clean up data attributes
                delete card.dataset.originalWidth;
                delete card.dataset.originalMarginRight;
            });
            
            // Force a reflow to ensure layout is settled
            grid.offsetWidth;
            
            // Refresh cached rects for visible cards AFTER layout settles
            projectCards.forEach(card => {
                if (matchesFilter(card, visibleFilter) && getComputedStyle(card).display !== 'none') {
                    try { prevRects.set(card, card.getBoundingClientRect()); } catch(_) {}
                }
                // keep last known rect in cache for hidden cards (don't delete)
            });
            
            grid.style.height = '';
            grid.style.width = '';
            grid.style.transition = '';
        }
        
        // Debounce filter clicks with better state management
        let filterBusy = false;
        let currentFilterPromise = null;
        let abortController = null;
        
        async function runFilterTransition(doWork) {
            // If already animating, cancel current animation and start new one
            if (filterBusy) {
                // Abort current animation
                if (abortController) {
                    abortController.abort();
                }
                // Cancel all animations
                cancelAll(projectCards);
                // Wait a bit longer for cleanup to complete
                await new Promise(r => setTimeout(r, 100));
            }
            
            // Create new abort controller for this animation
            abortController = new AbortController();
            const signal = abortController.signal;
            
            filterBusy = true;
            const promise = (async () => {
                try {
                    // Check if aborted before starting
                    if (signal.aborted) return;
                    
                    await doWork();
                } catch (error) {
                    // Ignore abort errors
                    if (error.name !== 'AbortError') {
                        console.error('Filter animation error:', error);
                    }
                } finally {
                    // Only reset if this is still the current animation
                    if (currentFilterPromise === promise) {
                        filterBusy = false;
                        currentFilterPromise = null;
                        abortController = null;
                    }
                }
            })();
            
            currentFilterPromise = promise;
            return promise;
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter') || 'all';
                latestFilter = filter;
                const myRunId = ++activeRunId;
                
                // If clicking same filter, ignore
                const currentActive = document.querySelector('.filter-btn.active');
                if (currentActive && currentActive.getAttribute('data-filter') === filter && !filterBusy) {
                    return; // Already on this filter and not animating
                }
                
                // Update button active state IMMEDIATELY so UI reflects user's choice
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Store reference to the button for use in async function
                const clickedButton = this;
                
                runFilterTransition(async () => {
                    // Suspend snapping and interactions during animation
                    const restoreSnap = suspendScrollSnap(grid);
                    const startScrollLeft = grid ? grid.scrollLeft : 0;
                    // Capture the abort signal for this specific transition
                    // This ensures we check the correct abort signal even if a new transition starts
                    const signal = abortController?.signal;
                    
                    // Cancel any previous animations on all cards first
                    cancelAll(projectCards);
                    
                    // 0) Clean up intermediate states from previous transitions
                    // But keep display state as-is so we can measure current positions
                    projectCards.forEach(card => {
                        // Clear any intermediate animation states
                        card.style.transform = '';
                        card.style.opacity = '';
                        // Don't blindly reset visibility/width; normalize intelligently below
                        card.classList.remove('is-exiting');
                        delete card.dataset.originalWidth;
                        delete card.dataset.originalMarginRight;

                        const computedStyle = window.getComputedStyle(card);
                        // If card is currently visible, ensure it has proper layout
                        if (computedStyle.display !== 'none') {
                            card.style.display = 'flex';
                            card.style.flexDirection = 'column';
                        }
                        // Normalize zombie states left from fast switches
                        if (computedStyle.display !== 'none' && card.offsetWidth === 0) {
                            card.style.width = '';
                            card.style.marginRight = '';
                            card.style.marginLeft = '';
                            card.style.overflow = '';
                            card.style.pointerEvents = '';
                            card.style.opacity = '';
                        }
                        if (computedStyle.visibility === 'hidden') {
                            card.style.visibility = '';
                        }
                    });
                    
                    // Force a reflow to ensure cleanup is applied
                    grid.offsetWidth;
                    
                    // 1) FIRST rects for currently visible cards (before any filter changes)
                    const firstRects = new Map();
                    projectCards.forEach(card => {
                        if (isActuallyVisible(card)) {
                            try {
                                const r = card.getBoundingClientRect();
                                firstRects.set(card, r);
                                prevRects.set(card, r); // <- keep cache fresh even if it will exit
                            } catch(_) {}
                        }
                    });
                    
                    // 2) Decide who stays, who enters, who exits - DO THIS EARLY
                    // This ensures the filter is applied even if animations are aborted
                    const toShow = new Set();
                    const toHide = new Set();
                    
                    projectCards.forEach(card => {
                        const shouldShow = matchesFilter(card, filter);
                        const visible = isActuallyVisible(card);
                        if (shouldShow && !visible) {
                            toShow.add(card);
                        } else if (!shouldShow && visible) {
                            toHide.add(card);
                        }
                        // Cards that should stay visible or stay hidden don't need action
                    });
                    
                    // Check if aborted - but still apply filter even if aborted
                    const wasAborted = signal?.aborted;
                    if (wasAborted) {
                        // Restore snapping before exiting early
                        if (typeof restoreSnap === 'function') restoreSnap();
                        finalizeStateAndRefreshCache(grid, latestFilter, myRunId);
                        if (projectsCarousel && typeof updateArrowStates === 'function') updateArrowStates();
                        return;
                    }
                    
                    // 3) Explicitly hide cards that should NOT be visible
                    // This prevents cards from previous states from appearing
                    projectCards.forEach(card => {
                        const shouldShow = matchesFilter(card, filter);
                        if (!shouldShow && !toHide.has(card)) {
                            // Card should be hidden but isn't in toHide (was already hidden or in wrong state)
                            card.style.display = 'none';
                        }
                    });
                    
                    // 4) Freeze container height to avoid jitter (don't lock width to reduce layout thrash)
                    const startHeight = grid.offsetHeight;
                    grid.style.height = startHeight + 'px';
                    // Avoid animating height here to keep things snappy
                    grid.style.transition = 'height 0ms';
                    
                    // 5) Prepare entering cards (show but invisible so they're in layout)
                    toShow.forEach(card => {
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        card.style.opacity = '0';
                        // Keep them in layout but invisible
                        card.style.visibility = 'hidden';
                    });

                    // 6) Prepare exiting cards: create overlay clones for smooth fade-out without affecting layout
                    const exitClones = new Map();
                    toHide.forEach(card => {
                        try {
                            const rect = card.getBoundingClientRect();
                            const clone = card.cloneNode(true);
                            const style = clone.style;
                            style.position = 'fixed';
                            style.left = rect.left + 'px';
                            style.top = rect.top + 'px';
                            style.width = rect.width + 'px';
                            style.height = rect.height + 'px';
                            style.margin = '0';
                            style.transform = 'none';
                            style.opacity = '1';
                            style.pointerEvents = 'none';
                            style.zIndex = '1000';
                            document.body.appendChild(clone);
                            exitClones.set(card, clone);
                        } catch (_) {}
                        // Remove originals from layout immediately for measurement
                        card.style.display = 'none';
                    });
                    
                    // Force layout recalculation with collapsed exiting cards
                    grid.offsetWidth; // reflow
                    grid.offsetHeight; // force another reflow
                    
                    // Check if aborted - apply filter even if aborted
                    if (signal?.aborted) {
                        if (typeof restoreSnap === 'function') restoreSnap();
                        finalizeStateAndRefreshCache(grid, latestFilter, myRunId);
                        if (projectsCarousel && typeof updateArrowStates === 'function') updateArrowStates();
                        return;
                    }
                    
                    // 7) Snapshot "LAST" rects of all cards that will be visible after filter
                    // Make entering cards visible for measurement (but keep opacity at 0 for animation)
                    toShow.forEach(card => {
                        card.style.visibility = 'visible';
                        card.style.transform = '';
                    });
                    // Force synchronous layout to settle before measurement
                    grid.offsetWidth; grid.offsetHeight; grid.offsetWidth;
                    
                    // Check if aborted after waiting - finalize filter application
                    if (signal?.aborted) {
                        if (typeof restoreSnap === 'function') restoreSnap();
                        finalizeStateAndRefreshCache(grid, latestFilter, myRunId);
                        if (projectsCarousel && typeof updateArrowStates === 'function') updateArrowStates();
                        return;
                    }
                    
                    
                    const lastRects = new Map();
                    // Measure all cards that should be visible according to the filter
                    projectCards.forEach(card => {
                        const shouldShow = matchesFilter(card, filter);
                        // Only measure cards that belong to this filter and are not exiting
                        if (shouldShow && !toHide.has(card)) {
                            const cs = window.getComputedStyle(card);
                            const visible = cs.display !== 'none' && cs.visibility !== 'hidden';
                            if (visible) {
                                try {
                                    const rect = card.getBoundingClientRect();
                                    if (rect.width > 0 && rect.height > 0) {
                                        lastRects.set(card, rect);
                                    }
                                } catch(_) {}
                            }
                        }
                    });
                    
                    // Do not force scrollLeft; avoid flicker from abrupt repositioning

                    // 8) Animate:
                    // 8a) FLIP for all visible cards (staying + newly shown)
                    const stayingAnims = [];
                    
                    // First, animate cards that are in lastRects (measured final positions)
                    // Skip entering cards - they'll get directional fade-in animation instead
                    lastRects.forEach((lastRect, card) => {
                        // Skip entering cards - they get directional fade-in, not FLIP
                        if (toShow.has(card)) {
                            return;
                        }
                        
                        // Staying cards: use previous geometry for FLIP
                        let firstRect = firstRects.get(card) || prevRects.get(card);
                        if (!firstRect) {
                            // Minimal offset to avoid exact no-op skip
                            firstRect = new DOMRect(
                                lastRect.left,
                                lastRect.top + 2,
                                lastRect.width,
                                lastRect.height
                            );
                        }
                        try { card.style.willChange = 'transform, opacity'; } catch(_){}
                        stayingAnims.push(flipAnimate(card, firstRect, lastRect, { duration: DURATION, easing: EASE_SPRING }));
                    });
                    
                    // 8b) entering cards: fade-in with directional slide
                    const enteringAnims = [];
                    [...toShow].forEach((card) => {
                        // cancel any leftover animations on this card
                        card.getAnimations({ subtree: false }).forEach(a => a.cancel());

                        // Start from slightly right and below, fade in while sliding to final position
                        const slideX = 40; // slide from right
                        const slideY = 15; // slight upward movement
                        
                        // Clear any existing transforms first
                        card.style.transform = '';
                        card.style.opacity = '0';
                        
                        // Force a reflow to ensure styles are applied
                        card.offsetHeight;
                        
                        // Set initial state with transform offset
                        card.style.willChange = 'transform, opacity';
                        card.style.transform = `translate3d(${slideX}px, ${slideY}px, 0)`;
                        card.style.opacity = '0';
                        
                        // Force another reflow to ensure transform is applied
                        card.offsetHeight;

                        // Animate both transform and opacity together smoothly
                        // Use fill: 'both' to ensure initial state is applied immediately
                        const anim = card.animate(
                            [
                                { 
                                    opacity: 0,
                                    transform: `translate3d(${slideX}px, ${slideY}px, 0)`
                                },
                                { 
                                    opacity: 1,
                                    transform: 'translate3d(0, 0, 0)'
                                }
                            ],
                            {
                                duration: DURATION_ENTER,   // ~800ms for smooth, elegant fade
                                easing: EASE_SOFT_OUT,      // smooth ease-out curve
                                fill: 'both',               // apply both start and end states
                                composite: 'replace'        // replace any existing transform
                            }
                        );

                        enteringAnims.push(
                            anim.finished.catch(() => {}).then(() => { 
                                card.style.willChange = '';
                                // Clear transform after animation completes
                                card.style.transform = '';
                                card.style.opacity = '';
                            })
                        );
                    });
                    
                    // 8c) exiting cards: fade/scale out using overlay clones (originals removed from layout)
                    const exitingPromises = [];
                    if (exitClones && exitClones.size) {
                        exitClones.forEach((clone, orig) => {
                            try { clone.getAnimations({ subtree: false }).forEach(a => a.cancel()); } catch (_) {}
                            const fadeAnim = clone.animate([
                                { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
                                { opacity: 0, transform: 'translate3d(0, -50px, 0) scale(0.9)' }
                            ], {
                            duration: DURATION_EXIT,
                            easing: EASE_SPRING,
                            fill: 'forwards',
                            composite: 'replace'
                        });
                            const done = fadeAnim.finished.catch(() => {}).then(() => {
                                if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                            });
                            exitingPromises.push(done);
                        });
                    }
                    
                    // 9) Animate container height from old to new
                    //    (measure after we applied visibility changes)
                    // For horizontal carousel, keep height constant to avoid scrollbar pop
                    const endHeight = startHeight; // Keep height constant for horizontal layout
                    grid.style.height = endHeight + 'px';
                    
                    // 10) Wait for animations to settle, then clean up
                    // Use Promise.race to allow aborting
                    const animationPromise = Promise.all([...stayingAnims, ...enteringAnims, ...exitingPromises]).catch(() => {});
                    const abortPromise = new Promise((resolve) => {
                        if (abortController) {
                            abortController.signal.addEventListener('abort', resolve, { once: true });
                        } else {
                            resolve();
                        }
                    });
                    
                    await Promise.race([animationPromise, abortPromise]);
                    
                    // Check if aborted - finalize filter if needed
                    if (signal?.aborted) {
                        // Cancel all animations and finalize filter state
                        cancelAll(projectCards);
                        // Remove any exit clones
                        if (exitClones && exitClones.size) {
                            exitClones.forEach((clone) => { try { if (clone.parentNode) clone.parentNode.removeChild(clone); } catch(_){} });
                            exitClones.clear?.();
                        }
                        if (typeof restoreSnap === 'function') restoreSnap();
                        finalizeStateAndRefreshCache(grid, latestFilter, myRunId);
                        if (projectsCarousel && typeof updateArrowStates === 'function') updateArrowStates();
                        return;
                    }
                    
                    // Clear all transforms from animations so cards return to natural layout
                    // Wait a frame to ensure animations have fully applied their final states
                    await new Promise(r => requestAnimationFrame(r));
                    
                    projectCards.forEach(card => {
                        const shouldShow = matchesFilter(card, filter);
                        if (shouldShow) {
                            // Clear transform so card returns to natural position
                            card.style.transform = '';
                        }
                    });
                    
                    // Force layout recalculation after clearing transforms
                    grid.offsetWidth;
                    grid.offsetHeight;
                    
                    // Minimal settle to ensure styles applied
                    await new Promise(r => requestAnimationFrame(r));
                    
                    // Final check before cleanup
                    if (signal?.aborted) return;
                    
                    finalizeStateAndRefreshCache(grid, latestFilter, myRunId);
                    if (projectsCarousel && typeof updateArrowStates === 'function') {
                        updateArrowStates();
                    }
                    // Re-enable interactions and restore scroll snapping
                    if (typeof restoreSnap === 'function') restoreSnap();
                    // Ensure any leftover exit clones are removed
                    if (exitClones && exitClones.size) {
                        exitClones.forEach((clone) => { try { if (clone.parentNode) clone.parentNode.removeChild(clone); } catch(_){} });
                        exitClones.clear?.();
                    }
                });
            });
        });
    }
    
    // Initialize project card styles (NO transitions - WAAPI handles all animations)
    projectCards.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
    
    // Seed the rect cache
    projectCards.forEach(card => {
        try {
            const r = card.getBoundingClientRect();
            prevRects.set(card, r);
        } catch(_) {}
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
        
        // Prevent body and html scroll when modal is open
        // Get scroll position before any changes
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        // Store scroll position for restoration (store as number, not string)
        modalOverlay.dataset.scrollY = scrollY.toString();
        
        // Apply fixed positioning to prevent scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.left = '0';
        document.documentElement.style.overflow = 'hidden';
        
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
            // Get stored scroll position before removing modal
            const scrollY = currentModal.dataset.scrollY ? parseInt(currentModal.dataset.scrollY, 10) : 0;
            
            // Temporarily disable smooth scroll behavior
            const html = document.documentElement;
            const originalScrollBehavior = html.style.scrollBehavior;
            html.style.scrollBehavior = 'auto';
            
            // Clear active nav link highlighting to prevent projects section from being highlighted
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            currentModal.classList.remove('active');
            
            // Wait for modal fade-out, then restore scroll before removing overlay
            setTimeout(() => {
                if (currentModal && currentModal.parentNode) {
                    // Restore scroll position while overlay is still covering the page
                    window.scrollTo(0, scrollY);
                    
                    // Small delay to ensure scroll is set, then restore styles and remove overlay
                    requestAnimationFrame(() => {
                        // Restore body and html scroll styles
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.top = '';
                        document.body.style.width = '';
                        document.body.style.left = '';
                        document.documentElement.style.overflow = '';
                        
                        // Ensure scroll position is maintained
                        window.scrollTo(0, scrollY);
                        
                        // Remove overlay after styles are restored
                        requestAnimationFrame(() => {
                            if (currentModal && currentModal.parentNode) {
                                currentModal.parentNode.removeChild(currentModal);
                            }
                            // Restore original scroll behavior
                            html.style.scrollBehavior = originalScrollBehavior || '';
                            currentModal = null;
                        });
                    });
                } else {
                    currentModal = null;
                }
            }, 300); // Wait for fade-out animation (shorter than full animation)
        }
    }
    
    // Open fullscreen iframe for visualizations
    function openFullscreenIframe(src, card) {
        // Create fullscreen iframe container
        const iframeContainer = document.createElement('div');
        iframeContainer.className = 'fullscreen-iframe-container';
        iframeContainer.innerHTML = `
            <button class="fullscreen-iframe-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
            <iframe src="${src}" class="fullscreen-iframe" frameborder="0"></iframe>
        `;
        
        document.body.appendChild(iframeContainer);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            iframeContainer.classList.add('active');
        }, 10);
        
        // Close button handler
        const closeBtn = iframeContainer.querySelector('.fullscreen-iframe-close');
        closeBtn.addEventListener('click', closeFullscreenIframe);
        
        // Close on Escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeFullscreenIframe();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Store current container
        currentModal = iframeContainer;
    }
    
    // Close fullscreen iframe
    function closeFullscreenIframe() {
        const container = document.querySelector('.fullscreen-iframe-container');
        if (container) {
            container.classList.remove('active');
            setTimeout(() => {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
                document.body.style.overflow = '';
                currentModal = null;
            }, 1100); // Wait for exit animation to complete (1s + buffer)
        }
    }
    
    // Add click handlers to project cards
    projectCards.forEach(card => {
        const iframeSrc = card.getAttribute('data-iframe');
        
        // For iframe projects, prevent links from navigating and make everything open popup
        if (iframeSrc) {
            // Prevent links inside iframe project cards from navigating
            const links = card.querySelectorAll('.project-link');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openFullscreenIframe(iframeSrc, card);
                });
            });
            
            // Handle clicks anywhere on the card
            card.addEventListener('click', function(e) {
                // If click is already handled by link handler above, skip
                if (e.target.closest('.project-link')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                openFullscreenIframe(iframeSrc, card);
            });
        } else {
            // For non-iframe projects, use modal behavior
            card.addEventListener('click', function(e) {
                // Don't open modal if clicking on links
                if (e.target.closest('.project-link') || e.target.closest('.project-overlay')) {
                    return;
                }
                // Open modal with this card's content
                openProjectModal(card);
            });
        }
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
