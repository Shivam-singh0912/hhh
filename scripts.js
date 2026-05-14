/**
 * GHARSETU | NAMBIAR-INSPIRED ANIMATION SYSTEM (v2)
 * Orchestrating premium scroll interactions, magnetic effects, and cinematic lifecycle.
 */

(function NambiarAnimations() {
    "use strict";

    // ─── STATE MANAGEMENT ───
    const state = {
        lastScrollY: 0,
        isMenuOpen: false,
        isLoaded: false
    };

    // ─── DOM ELEMENTS ───
    const elements = {
        header: document.getElementById('main-header'),
        progress: document.getElementById('nmb-progress'),
        loader: document.getElementById('nb-page-loader'),
        loaderFill: document.querySelector('.nb-loader-fill'),
        cursorDot: document.getElementById('nmb-cursor-dot2'),
        cursorRing: document.getElementById('nmb-cursor-ring'),
        heroVideo: document.getElementById('hero-video'),
        menuTrigger: document.getElementById('menu-trigger'),
        megaMenu: document.getElementById('mega-menu'),
        searchTrigger: document.getElementById('search-trigger'),
        searchOverlay: document.getElementById('search-overlay'),
        searchClose: document.getElementById('search-close')
    };

    // ─── 1. PAGE LOADER LIFECYCLE ───
    function initLoader() {
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 30;
            if (width > 100) {
                width = 100;
                clearInterval(interval);
                completeLoading();
            }
            if (elements.loaderFill) elements.loaderFill.style.width = width + '%';
        }, 200);
    }

    function completeLoading() {
        setTimeout(() => {
            if (elements.loader) {
                elements.loader.classList.add('loader-hidden');
            }
            state.isLoaded = true;
            document.body.classList.add('nmb-loaded');

            // Trigger Hero Animations after loader starts exiting
            setTimeout(() => {
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) heroContent.classList.add('hero-active');

                const heroVideo = document.getElementById('hero-video');
                if (heroVideo) heroVideo.classList.add('video-active');
            }, 600);
        }, 800);
    }

    // ─── 3. HEADER & SCROLL PROGRESS ───
    function handleScroll() {
        if (!elements.header) return;

        const currentScroll = window.pageYOffset;
        const totalHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

        // Progress Bar
        const progressWidth = (currentScroll / totalHeight) * 100;
        if (elements.progress) elements.progress.style.width = progressWidth + '%';

        // Sticky Header Logic
        if (currentScroll > 100) {
            elements.header.classList.add('nav--scrolled');
        } else {
            elements.header.classList.remove('nav--scrolled');
        }

        // Header always visible while scrolling
        elements.header.style.transform = 'translateY(0)';

        state.lastScrollY = currentScroll;
    }

    // (Legacy initAOS removed — replaced by PremiumScrollEngine)

    // ─── 5. STATISTICS COUNTER ───
    function initCounters(counterElements) {
        counterElements.forEach(counter => {
            if (counter.closest('.stats-section')) {
                startInfiniteCounter(counter);
                return;
            }

            if (counter.classList.contains('counted')) return;

            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                    counter.classList.add('counted');
                }
            };
            updateCount();
        });
    }

    function startInfiniteCounter(counter) {
        if (counter.dataset.looping === 'true') return;

        counter.dataset.looping = 'true';
        const target = +counter.getAttribute('data-target');
        const duration = 1800;

        const run = () => {
            const startedAt = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - startedAt) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                if (progress < 1) {
                    counter.innerText = Math.ceil(target * eased);
                    requestAnimationFrame(tick);
                } else {
                    counter.innerText = target;
                    // Immediately loop the animation without pausing
                    requestAnimationFrame(run);
                }
            };

            requestAnimationFrame(tick);
        };

        run();
    }

    function initInteractions() {
        // Dynamic Close Button for Mega Menu
        if (elements.megaMenu && !document.getElementById('mega-close-dynamic')) {
            const closeBtn = document.createElement('div');
            closeBtn.id = 'mega-close-dynamic';
            closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '25px';
            closeBtn.style.right = '30px';
            closeBtn.style.fontSize = '1.8rem';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.color = '#333';
            closeBtn.style.zIndex = '2001';
            
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                state.isMenuOpen = false;
                elements.megaMenu.classList.remove('active');
                if (elements.menuTrigger) elements.menuTrigger.classList.remove('active');
            });
            
            elements.megaMenu.prepend(closeBtn);
        }

        // Mega Menu Toggle
        if (elements.menuTrigger) {
            elements.menuTrigger.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click from firing immediately
                state.isMenuOpen = !state.isMenuOpen;
                elements.megaMenu.classList.toggle('active');
                elements.menuTrigger.classList.toggle('active');
            });
        }

        // Close Menu on Outside Click
        document.addEventListener('click', (e) => {
            if (state.isMenuOpen && elements.megaMenu && elements.menuTrigger && !elements.megaMenu.contains(e.target) && !elements.menuTrigger.contains(e.target)) {
                state.isMenuOpen = false;
                elements.megaMenu.classList.remove('active');
                elements.menuTrigger.classList.remove('active');
            }
        });

        // Search Overlay
        if (elements.searchTrigger) {
            elements.searchTrigger.addEventListener('click', () => {
                if (!elements.searchOverlay) return;
                elements.searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        if (elements.searchClose) {
            elements.searchClose.addEventListener('click', () => {
                if (!elements.searchOverlay) return;
                elements.searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Finder Tabs
        const finderTabs = document.querySelectorAll('.finder-tab');
        finderTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                finderTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Appointment Modal
        const modal = document.getElementById('appointment-modal');
        const modalTriggers = [
            document.getElementById('consultation-trigger'),
            document.getElementById('mobile-consultation-trigger'),
            document.getElementById('hero-consult-trigger'),
            ...document.querySelectorAll('.btn-wwd[href="#"]')
        ];
        const modalClose = document.getElementById('modal-close');

        if (modal) {
            modalTriggers.forEach(trigger => {
                if (trigger) {
                    trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        if (state.isMenuOpen && elements.megaMenu && elements.menuTrigger) {
                            elements.megaMenu.classList.remove('active');
                            elements.menuTrigger.classList.remove('active');
                            state.isMenuOpen = false;
                        }
                    });
                }
            });

            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Property Type Tabs
        const propTabs = document.querySelectorAll('.prop-tab[data-panel]');
        const propPanels = document.querySelectorAll('.prop-panel');
        propTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetPanel = document.getElementById(tab.dataset.panel);
                if (!targetPanel) return;

                propTabs.forEach(item => item.classList.remove('active'));
                propPanels.forEach(panel => panel.classList.remove('active'));
                tab.classList.add('active');
                targetPanel.classList.add('active');
            });
        });
    }

    // ─── 7. HERO SLIDER (Fallback for Video) ───
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero .slide');
        if (slides.length <= 1) return;

        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // ─── INITIALIZE ALL ───
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        initInteractions();
        initHeroSlider();
        initCursorGlow();
        initServiceCardTilt();


        window.addEventListener('scroll', handleScroll, { passive: true });

        // Ensure video is playing
        if (elements.heroVideo) {
            elements.heroVideo.play().catch(() => {
                console.log('Autoplay prevented, fallback to slides active.');
            });
        }
    });

    // ─── 8. PREMIUM CURSOR GLOW TRAIL ───
    function initCursorGlow() {
        const glow = document.createElement('div');
        glow.id = 'gs-cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
            transform: translate(-50%, -50%);
            transition: left 0.5s cubic-bezier(0.23, 1, 0.32, 1), top 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            mix-blend-mode: screen;
        `;
        document.body.appendChild(glow);

        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ─── 9. PREMIUM 3D TILT ON HOME SERVICE CARDS ───
    function initServiceCardTilt() {
        const cards = document.querySelectorAll('.home-services-premium .service-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(12px)`;
                card.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.3), 0 0 30px rgba(197,160,89,0.12)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
                card.style.boxShadow = '';
            });
        });
    }



})();


// ─── SMOOTH SECTION HEADER LETTER STAGGER ───
document.addEventListener('DOMContentLoaded', () => {


    const hsCards = document.querySelectorAll('.home-services-premium .service-card');
    const hsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hsCards.forEach((card, i) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 100);
                });
                hsObserver.disconnect();
            }
        });
    }, { threshold: 0.15 });

    const hsGrid = document.querySelector('.home-services-premium .services-grid');
    if (hsGrid) {
        hsCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1), border-color 0.4s, box-shadow 0.4s';
        });
        hsObserver.observe(hsGrid);
    }
});


/* ═══════════════════════════════════════════════════════════
   ✦ GHARSETU PREMIUM SCROLL ANIMATION ENGINE ✦
   - Directional Reveals  (fade-up / fade-left / fade-right / scale-in)
   - Staggered children   (data-stagger on parent)
   - Cinematic heading split (data-split-text)
   - Parallax depth layers
═══════════════════════════════════════════════════════════ */
(function PremiumScrollEngine() {
    "use strict";

    // ── Inject CSS once ──────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        /* Base hidden states */
        [data-anim] {
            opacity: 0;
            will-change: opacity, transform;
            transition-property: opacity, transform;
            transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
            transition-duration: 0.85s;
        }
        [data-anim="fade-up"]    { transform: translateY(55px); }
        [data-anim="fade-down"]  { transform: translateY(-40px); }
        [data-anim="fade-left"]  { transform: translateX(-55px); }
        [data-anim="fade-right"] { transform: translateX(55px); }
        [data-anim="scale-in"]   { transform: scale(0.88); }
        [data-anim="flip-up"]    { transform: rotateX(25deg) translateY(40px); transform-origin: bottom; }

        /* Revealed state */
        [data-anim].gs-visible {
            opacity: 1;
            transform: none;
        }
        [data-anim][data-delay] {
            transition-delay: attr(data-delay ms);
        }

        /* ── Split-text heading ── */
        .gs-split-word {
            display: inline-block;
            overflow: hidden;
            vertical-align: bottom;
            margin-right: 0.22em;
        }
        .gs-split-char {
            display: inline-block;
            opacity: 0;
            transform: translateY(110%) rotate(4deg);
            transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                        transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .gs-split-char.gs-char-visible {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
        }

        /* ── Parallax wrapper ── */
        .gs-parallax { will-change: transform; }

        /* ── Horizontal rule reveal ── */
        .gs-line-reveal {
            display: block;
            width: 0;
            height: 2px;
            background: var(--accent-color, #c5a059);
            transition: width 1s cubic-bezier(0.22,1,0.36,1);
        }
        .gs-line-reveal.gs-visible { width: 100%; }
    `;
    document.head.appendChild(style);

    function initSocialOrb() {
        const orbWrap = document.getElementById('social-orb-wrap');
        const orb = document.getElementById('social-orb');
        const backdrop = document.getElementById('orb-backdrop');

        if (!orbWrap || !orb) return;

        function toggleOrb(e) {
            e.preventDefault();
            e.stopPropagation();
            orbWrap.classList.toggle('is-open');
        }

        function closeOrb(e) {
            // Only close if clicking outside the orb button and outside the links area
            if (orb.contains(e.target) || (orbLinks && orbLinks.contains(e.target))) {
                return;
            }
            orbWrap.classList.remove('is-open');
        }

        orb.addEventListener('click', toggleOrb);
        
        // Ensure links are clickable and stop propagation to document for them
        const links = orbWrap.querySelectorAll('.orb-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Let the link navigate normally, but stop the orb from closing via document click
                e.stopPropagation();
            });
        });
        
        // --- Magnetic Effect ---
        document.addEventListener('mousemove', (e) => {
            const rect = orb.getBoundingClientRect();
            const orbX = rect.left + rect.width / 2;
            const orbY = rect.top + rect.height / 2;
            
            const distX = e.clientX - orbX;
            const distY = e.clientY - orbY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance < 120) {
                const strength = 0.25;
                const moveX = distX * strength;
                const moveY = distY * strength;
                
                if (orbWrap.classList.contains('is-open')) {
                    // Maintain rotation and open scale while adding translation
                    orb.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.12) rotate(135deg)`;
                } else {
                    orb.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
                }
            } else {
                if (orbWrap.classList.contains('is-open')) {
                    orb.style.transform = `scale(1.12) rotate(135deg)`;
                } else {
                    orb.style.transform = `translate(0, 0) scale(1)`;
                }
            }
        });

        // --- 3D Sphere Positioning ---
        const tiles = orbWrap.querySelectorAll('.orb-tile');
        const radius = 15; // Sphere radius in px
        
        tiles.forEach((tile, i) => {
            const phi = Math.acos(-1 + (2 * i) / tiles.length);
            const theta = Math.sqrt(tiles.length * Math.PI) * phi;
            
            const rotY = (theta * 180 / Math.PI);
            const rotX = (phi * 180 / Math.PI) - 90;
            
            tile.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${radius}px)`;
        });

        // Prevent closing when clicking the links themselves
        const orbLinks = orbWrap.querySelector('.orb-links');
        if (orbLinks) {
            orbLinks.addEventListener('click', (e) => e.stopPropagation());
        }

        if (backdrop) backdrop.addEventListener('click', closeOrb);
        document.addEventListener('click', closeOrb);
    }

    // ── Auto-tag elements that already use .reveal (backward compat) ──
    document.querySelectorAll('.reveal:not([data-anim])').forEach(el => {
        el.setAttribute('data-anim', 'fade-up');
    });

    // ── Stagger children: assign per-child delays ──────────────
    document.querySelectorAll('[data-stagger]').forEach(parent => {
        const gap = parseInt(parent.getAttribute('data-stagger')) || 100;
        [...parent.children].forEach((child, i) => {
            child.setAttribute('data-anim', child.getAttribute('data-anim') || 'fade-up');
            child.style.transitionDelay = (i * gap) + 'ms';
        });
    });

    // ── Intersection Observer — directional reveals ────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('gs-visible');
                // also keep old .active for backward compat
                entry.target.classList.add('active');

                // fire counters if present
                const counters = entry.target.querySelectorAll('.stat-number');
                if (counters.length) fireCounters(counters);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-anim]').forEach(el => revealObserver.observe(el));

    // ── Stat counters (Infinite Loop) ──────────────────────────
    function fireCounters(els) {
        els.forEach(el => {
            if (el.dataset.looping) return;
            el.dataset.looping = 'true';
            const target = +el.getAttribute('data-target');
            const dur = 1800;

            const run = () => {
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.ceil(target * eased);
                    if (p < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = target;
                        // Infinite loop without pausing
                        requestAnimationFrame(run);
                    }
                };
                requestAnimationFrame(tick);
            };
            run();
        });
    }

    // ── Split-Text headings (data-split-text attr) ─────────────
    function initSplitText() {
        document.querySelectorAll('[data-split-text]').forEach(el => {
            const words = el.textContent.trim().split(' ');
            el.innerHTML = words.map(word =>
                `<span class="gs-split-word">${[...word].map((ch, ci) =>
                    `<span class="gs-split-char" style="transition-delay:${ci * 40}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`
                ).join('')
                }</span>`
            ).join(' ');

            const charObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.querySelectorAll('.gs-split-char').forEach((ch, i) => {
                            setTimeout(() => ch.classList.add('gs-char-visible'), i * 38);
                        });
                        charObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            charObserver.observe(el);
        });
    }

    // ── Parallax depth on sections ─────────────────────────────
    function initParallax() {
        const parallaxEls = document.querySelectorAll('[data-parallax]');
        if (!parallaxEls.length) return;

        const onScroll = () => {
            const scrollY = window.pageYOffset;
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                el.style.transform = `translateY(${center * speed}px)`;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── Horizontal accent line reveals ────────────────────────
    function initLineReveals() {
        const lines = document.querySelectorAll('.gs-line-reveal');
        const lo = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('gs-visible'); });
        }, { threshold: 0.5 });
        lines.forEach(l => lo.observe(l));
    }

    // ── Auto-apply data-anim to common selectors ───────────────
    function autoTag() {
        const rules = [
            { sel: '.stat-item', anim: 'scale-in' },
            { sel: '.award-item', anim: 'fade-up' },
            { sel: '.about-text-content', anim: 'fade-left' },
            { sel: '.about-image-content', anim: 'fade-right' },
            { sel: '.sustainability-image', anim: 'fade-left' },
            { sel: '.sustainability-text', anim: 'fade-right' },
            { sel: '.footer-col', anim: 'fade-up' },
        ];
        rules.forEach(({ sel, anim }) => {
            document.querySelectorAll(sel + ':not([data-anim])').forEach((el, i) => {
                el.setAttribute('data-anim', anim);
                el.style.transitionDelay = (i * 80) + 'ms';
                revealObserver.observe(el);
            });
        });

        // Add split-text to section h2s that don't already have it
        document.querySelectorAll('.section h2:not([data-split-text]):not(.no-split)').forEach(h2 => {
            h2.setAttribute('data-split-text', '');
        });
    }

    // ── Kick everything off ────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        autoTag();
        initSplitText();
        initParallax();
        initLineReveals();
        initSocialOrb();
    }

})(); // end PremiumScrollEngine



// ---------------------------------------------
// DRAGGABLE FAB � Desktop (mouse) + Mobile (touch)
// ---------------------------------------------
(function initDraggableFAB() {
    const orb = document.getElementById('social-orb-wrap');
    if (!orb) return;

    let isDragging = false;
    let startX, startY, startLeft, startTop;

    // Restore saved position safely within bounds
    const saved = JSON.parse(localStorage.getItem('fabPos') || 'null');
    function applyBounds(left, top) {
        const fabW = orb.offsetWidth || 54;
        const fabH = orb.offsetHeight || 54;
        const maxX = window.innerWidth - fabW;
        const maxY = window.innerHeight - fabH;
        // Re-snap to edges if screen resized
        const snapX = (left + fabW / 2) < window.innerWidth / 2 ? 16 : window.innerWidth - fabW - 16;
        const safeLeft = Math.min(Math.max(snapX, 16), Math.max(16, maxX - 16));
        const safeTop  = Math.min(Math.max(top, 16), Math.max(16, maxY - 16));
        orb.style.right  = 'auto';
        orb.style.bottom = 'auto';
        orb.style.left   = safeLeft + 'px';
        orb.style.top    = safeTop  + 'px';
    }

    if (saved) {
        // Use a slight timeout to ensure offsetWidth is available or fallback
        setTimeout(() => applyBounds(saved.left, saved.top), 10);
    }

    window.addEventListener('resize', () => {
        if (orb.style.left) {
            applyBounds(parseFloat(orb.style.left), parseFloat(orb.style.top));
        }
    });

    function getPos(e) {
        const t = e.touches ? e.touches[0] : e;
        return { x: t.clientX, y: t.clientY };
    }

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function onStart(e) {
        if (e.target.closest('.orb-link') || e.target.closest('.orb-backdrop')) return;
        isDragging = true;
        const pos  = getPos(e);
        const rect = orb.getBoundingClientRect();
        startX = pos.x; startY = pos.y;
        startLeft = rect.left; startTop = rect.top;
        orb.style.right  = 'auto';
        orb.style.bottom = 'auto';
        orb.style.left   = startLeft + 'px';
        orb.style.top    = startTop  + 'px';
        orb.classList.add('is-dragging');
        if (e.type === 'mousedown') {
            e.preventDefault();
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup',   onEnd);
        } else {
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend',  onEnd);
        }
    }

    function onMove(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();
        const pos  = getPos(e);
        const maxX = window.innerWidth  - orb.offsetWidth;
        const maxY = window.innerHeight - orb.offsetHeight;
        orb.style.left = clamp(startLeft + pos.x - startX, 8, maxX - 8) + 'px';
        orb.style.top  = clamp(startTop  + pos.y - startY, 8, maxY - 8) + 'px';
    }

    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        orb.classList.remove('is-dragging');
        const rect  = orb.getBoundingClientRect();
        const snapX = (rect.left + orb.offsetWidth / 2) < window.innerWidth / 2
            ? 16 : window.innerWidth - orb.offsetWidth - 16;
        orb.style.transition = 'left 0.35s cubic-bezier(0.23,1,0.32,1), top 0.35s cubic-bezier(0.23,1,0.32,1)';
        orb.style.left = snapX + 'px';
        orb.style.top  = clamp(rect.top, 16, window.innerHeight - orb.offsetHeight - 16) + 'px';
        setTimeout(() => {
            localStorage.setItem('fabPos', JSON.stringify({ left: parseFloat(orb.style.left), top: parseFloat(orb.style.top) }));
            orb.style.transition = '';
        }, 380);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend',  onEnd);
    }

    orb.addEventListener('mousedown',  onStart);
    orb.addEventListener('touchstart', onStart, { passive: false });
})();

// ---------------------------------------------
// ENQUIRY MODAL LOGIC
// ---------------------------------------------
(function initEnquiryModal() {
    const enquiryModal = document.getElementById('enquiry-modal');
    const enquiryTrigger = document.getElementById('enquire-now-trigger');
    const enquiryClose = document.getElementById('enquiry-modal-close');

    if (enquiryModal && enquiryTrigger) {
        enquiryTrigger.addEventListener('click', () => {
            enquiryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (enquiryClose) {
            enquiryClose.addEventListener('click', () => {
                enquiryModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close on overlay click
        enquiryModal.addEventListener('click', (e) => {
            if (e.target === enquiryModal) {
                enquiryModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && enquiryModal.classList.contains('active')) {
                enquiryModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle form submission (prevent default and show alert)
        const form = enquiryModal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your enquiry! We will get back to you soon.');
                enquiryModal.classList.remove('active');
                document.body.style.overflow = '';
                form.reset();
            });
        }
    }
})();
