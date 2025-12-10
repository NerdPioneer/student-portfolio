// ==============================================
// UMIAMI ANALYTICS TRACKING
// ==============================================

// Enhanced Umami tracking for better insights
function trackEvent(eventName, eventData = {}) {
    try {
        if (typeof umami !== 'undefined') {
            umami.track(eventName, eventData);
        }
    } catch (error) {
        console.warn('Analytics tracking error:', error);
    }
}

// Track page views and user interactions
function initAnalytics() {
    // Track page load
    trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            trackEvent('navigation_click', {
                link_text: e.target.textContent.trim(),
                link_href: e.target.href,
                section: e.target.getAttribute('href')?.replace('#', '') || 'unknown'
            });
        });
    });
    
    // Track project card interactions
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const projectTitle = card.querySelector('h3')?.textContent || 'Unknown Project';
            trackEvent('project_interaction', {
                project: projectTitle,
                action: 'click'
            });
        });
    });
    
    
    // Track scroll depth with throttling for performance
    let maxScrollDepth = 0;
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (maxScrollDepth % 25 === 0) { // Track every 25%
                    trackEvent('scroll_depth', {
                        depth: maxScrollDepth,
                        page: window.location.pathname
                    });
                }
            }
            scrollTimeout = null;
        }, 100); // Throttle to 100ms
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            seconds: timeOnPage,
            page: window.location.pathname
        });
    });
}

// ==============================================
// NAVBAR FUNCTIONALITY
// ==============================================

function initNavbar() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    const navbar = document.querySelector('.desktop-nav');
    
    if (!navToggle || !navMenu) {
        return;
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Enhanced navbar scroll effect
    let lastScrollTop = 0;
    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                }
            } else {
                navbar.classList.remove('scrolled', 'hidden');
            }
        }
        lastScrollTop = scrollTop;
    }
    
    // Throttled scroll handler for better performance
    let ticking = false;
    function throttledScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Toggle mobile menu with enhanced animations
    function toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('open');
        
        if (isOpen) {
            // Enhanced close animation
            navMenu.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            navMenu.classList.remove('open');
            navMenu.style.maxHeight = '0px';
            navMenu.style.opacity = '0';
            navMenu.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                navMenu.style.display = '';
                navMenu.style.transition = '';
            }, 400);
            
            navToggle.setAttribute('aria-expanded', 'false');
            hamburgerLines.forEach((line, index) => {
                line.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                line.style.transform = '';
                line.style.opacity = '';
            });
            
            if (isMobile) {
                document.body.style.overflow = '';
                document.body.style.position = '';
            }
        } else {
            // Enhanced open animation
            navMenu.style.display = 'block';
            navMenu.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            navMenu.style.opacity = '0';
            navMenu.style.transform = 'translateY(-10px)';
            
            // Force reflow
            navMenu.offsetHeight;
            
            const setHeight = () => {
                navMenu.style.maxHeight = navMenu.scrollHeight + 'px';
                navMenu.style.opacity = '1';
                navMenu.style.transform = 'translateY(0)';
            };
            
            requestAnimationFrame(setHeight);
            
            navMenu.classList.add('open');
            navToggle.setAttribute('aria-expanded', 'true');
            
            // Enhanced hamburger animation
            hamburgerLines.forEach((line, index) => {
                line.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                if (index === 0) {
                    line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                } else if (index === 1) {
                    line.style.opacity = '0';
                } else if (index === 2) {
                    line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                }
            });
            
            if (isMobile) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
        }
    }
    
    // Add click event to toggle button
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu(e);
            }
        }
    });
    
    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMobileMenu(e);
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024 && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navMenu.style.maxHeight = '';
                navMenu.style.opacity = '';
                navMenu.style.transform = '';
                navToggle.setAttribute('aria-expanded', 'false');
                
                hamburgerLines.forEach(line => {
                    line.style.transition = '';
                    line.style.transform = '';
                    line.style.opacity = '';
                });
                
                if (isMobile) {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            }
        }, 250);
    });
}

// ==============================================
// PHOTO CAROUSEL FUNCTIONALITY
// ==============================================

let currentSlide = 0;
let slidesCount = 0;
let autoPlayInterval;

function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!carouselContainer || slides.length === 0) {
        return;
    }
    
    slidesCount = slides.length;
    
    // Initialize first slide
    updateCarousel();
    
    // Add dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play functionality
    startAutoPlay();
    
    // Pause auto-play on hover
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeSlide(1); // Swipe left
            } else {
                changeSlide(-1); // Swipe right
            }
        }
    }
}

function changeSlide(direction) {
    currentSlide = (currentSlide + direction + slidesCount) % slidesCount;
    updateCarousel();
    resetAutoPlay();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    // Update slides
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoPlay() {
    if (autoPlayInterval) return;
    
    autoPlayInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// ==============================================
// SMOOTH SCROLLING
// ==============================================

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.desktop-nav');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                
                // Enhanced mobile support - account for mobile navbar height
                const isMobile = window.innerWidth <= 1023;
                const mobileOffset = isMobile ? 20 : 20; // Consistent offset for both
                const targetPosition = targetElement.offsetTop - navbarHeight - mobileOffset;
                
                // Close mobile menu if open (for mobile nav links)
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('open')) {
                    // Close mobile menu first
                    navMenu.classList.remove('open');
                    navMenu.style.maxHeight = '0px';
                    navMenu.style.opacity = '0';
                    navMenu.style.transform = 'translateY(-10px)';
                    
                    // Reset body styles for mobile
                    if (isMobile) {
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                        document.body.style.width = '';
                    }
                    
                    // Wait for menu to close, then scroll
                    setTimeout(() => {
                        // Recalculate position after menu closes
                        const updatedNavbarHeight = navbar ? navbar.offsetHeight : 0;
                        const updatedTargetPosition = targetElement.offsetTop - updatedNavbarHeight - mobileOffset;
                        
                        window.scrollTo({
                            top: updatedTargetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                } else {
                    // Direct scroll if menu is not open
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ==============================================
// BACK TO TOP BUTTON
// ==============================================

function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '▲';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    
    // Style the button - minimal inline styles, rest handled by CSS
    Object.assign(backToTopBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        zIndex: '1000'
    });
    
    // Hover effects now handled by CSS
    
    // Add click functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add focus styles
    backToTopBtn.addEventListener('focus', () => {
        backToTopBtn.style.outline = '2px solid #60a5fa';
        backToTopBtn.style.outlineOffset = '2px';
    });
    
    backToTopBtn.addEventListener('blur', () => {
        backToTopBtn.style.outline = 'none';
    });
    
    // Initialize button state
    toggleBackToTop();
    
    // Add scroll listener
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    // Add button to DOM
    document.body.appendChild(backToTopBtn);
}

function toggleBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Show button when scrolled down and there's more content below
    if (scrollTop > windowHeight && scrollTop + windowHeight < documentHeight - 100) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

// ==============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==============================================

function initIntersectionObserver() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.section, .project-card, .education-card, .skill-group');
    
    if (animatedElements.length === 0) {
        return;
    }
    
    // Animation options
    const animationOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, animationOptions);
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        // Add initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add animation class
        element.classList.add('scroll-animate');
        
        observer.observe(element);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .scroll-animate.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .animate-child {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-child.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Rotating quotes enhancements */
        .rotating-quotes-container {
            min-height: 120px; /* Prevent layout shift */
        }
        
        .quote-block {
            will-change: opacity, transform; /* Optimize for animations */
        }
        
        .quote-dot {
            cursor: pointer;
            border: none;
            background: none;
            padding: 0;
            margin: 0;
        }
        
        .quote-dot:focus {
            outline: 2px solid #60a5fa;
            outline-offset: 2px;
        }
        
        .quote-dot:focus:not(:focus-visible) {
            outline: none;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .rotating-quotes-container {
                min-height: 120px;
                padding: 1rem !important;
                margin: 0 0.5rem;
            }
            
            .quote-block p {
                font-size: 1rem !important;
                line-height: 1.6 !important;
                padding: 0 0.5rem;
                word-wrap: break-word;
                hyphens: auto;
            }
            
            .quote-block footer {
                font-size: 0.875rem !important;
                margin-top: 0.5rem !important;
            }
            
            /* Larger touch targets for mobile */
            .quote-dot {
                width: 12px !important;
                height: 12px !important;
                margin: 0 4px !important;
            }
            
            /* Better spacing for mobile */
            .quote-content-wrapper {
                padding: 0.5rem 0;
            }
            
            /* Ensure proper text wrapping */
            .quote-block {
                word-break: break-word;
                overflow-wrap: break-word;
            }
        }
        
        /* Extra small mobile devices */
        @media (max-width: 480px) {
            .rotating-quotes-container {
                min-height: 100px;
                padding: 0.75rem !important;
                margin: 0 0.25rem;
            }
            
            .quote-block p {
                font-size: 0.9rem !important;
                line-height: 1.5 !important;
                padding: 0 0.25rem;
            }
            
            .quote-block footer {
                font-size: 0.8rem !important;
            }
            
            /* Smaller dots for very small screens */
            .quote-dot {
                width: 10px !important;
                height: 10px !important;
                margin: 0 3px !important;
            }
        }
        
        /* Landscape mobile orientation */
        @media (max-width: 768px) and (orientation: landscape) {
            .rotating-quotes-container {
                min-height: 80px;
                padding: 0.5rem !important;
            }
            
            .quote-block p {
                font-size: 0.9rem !important;
                line-height: 1.4 !important;
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .quote-block {
                transition: none !important;
            }
            
            .quote-dot {
                transition: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==============================================
// MOBILE MENU TOGGLE (for articles pages)
// ==============================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// ==============================================
// ROTATING QUOTES FUNCTIONALITY
// ==============================================

function initRotatingQuotes() {
    const quotes = [
        {
            text: "Commit to the Lord whatever you do, and he will establish your plans.",
            author: "Proverbs 16:3"
        },
        {
            text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            author: "Proverbs 3:5–6"
        },
        {
            text: "Every next level will demand a different version of you.",
            author: "Leonardo DiCaprio"
        },
        {
            text: "Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank.",
            author: "Proverbs 22:29"
        },
        {
            text: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
            author: "Luke 16:10 (NIV)"
        },
        {
            text: "A good name is more desirable than great riches; to be esteemed is better than silver or gold.",
            author: "Proverbs 22:1 (NIV)"
        }
    ];

    // Get DOM elements with error checking
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteBlock = document.getElementById('quote-block');
    const quoteDots = document.querySelectorAll('.quote-dot');
    const quotesContainer = document.querySelector('.rotating-quotes-container');
    const loadingIndicator = document.getElementById('quote-loading');
    
    // Early return if essential elements are missing
    if (!quoteText || !quoteAuthor || !quoteBlock || quoteDots.length === 0) {
        console.warn('Rotating quotes: Required elements not found');
        return;
    }

    let currentQuoteIndex = 0;
    let autoRotateInterval = null;
    let isTransitioning = false;
    let isHovered = false;
    let isPaused = false;

    // Smooth transition function with fade effect
    function updateQuote(index, skipTransition = false) {
        if (isTransitioning || index === currentQuoteIndex) return;
        
        const quote = quotes[index];
        if (!quote) {
            console.error('Rotating quotes: Invalid quote index', index);
            return;
        }

        isTransitioning = true;
        
        // Show loading indicator for longer quotes
        if (quote.text.length > 100 && loadingIndicator) {
            loadingIndicator.style.opacity = '1';
        }

        if (skipTransition) {
            // Immediate update without transition
            quoteText.textContent = `"${quote.text}"`;
            quoteAuthor.textContent = `— ${quote.author}`;
            updateDots(index);
            currentQuoteIndex = index;
            isTransitioning = false;
            if (loadingIndicator) loadingIndicator.style.opacity = '0';
            return;
        }

        // Smooth fade transition
        quoteBlock.style.opacity = '0';
        quoteBlock.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            // Update content
            quoteText.textContent = `"${quote.text}"`;
            quoteAuthor.textContent = `— ${quote.author}`;
            
            // Update dots
            updateDots(index);
            
            // Fade back in
            quoteBlock.style.opacity = '1';
            quoteBlock.style.transform = 'translateY(0)';
            
            currentQuoteIndex = index;
            isTransitioning = false;
            
            if (loadingIndicator) loadingIndicator.style.opacity = '0';
        }, 250); // Half of transition duration
    }

    function updateDots(index) {
        quoteDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.remove('bg-gray-600', 'hover:bg-gray-400');
                dot.classList.add('bg-blue-500');
                dot.setAttribute('aria-pressed', 'true');
                dot.setAttribute('aria-selected', 'true');
                dot.setAttribute('tabindex', '0');
            } else {
                dot.classList.remove('bg-blue-500');
                dot.classList.add('bg-gray-600', 'hover:bg-gray-400');
                dot.setAttribute('aria-pressed', 'false');
                dot.setAttribute('aria-selected', 'false');
                dot.setAttribute('tabindex', '-1');
            }
        });
    }

    function nextQuote() {
        if (isTransitioning || isPaused) return;
        const nextIndex = (currentQuoteIndex + 1) % quotes.length;
        updateQuote(nextIndex);
    }

    function startAutoRotate() {
        if (autoRotateInterval || isPaused) return;
        
        // Enhanced mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Determine if we're on a mobile device (more comprehensive check)
        const isMobileDevice = isMobile || (isSmallScreen && isTouchDevice);
        
        // Adjust timing based on device type and screen size
        let intervalTime;
        if (isMobileDevice) {
            if (window.innerWidth <= 480) {
                intervalTime = 9000; // Extra long for very small screens
            } else {
                intervalTime = 8000; // Long for mobile
            }
        } else {
            intervalTime = 7000; // Standard for desktop
        }
        
        autoRotateInterval = setInterval(() => {
            if (!isHovered && !isPaused) {
                nextQuote();
            }
        }, intervalTime);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    function resetAutoRotate() {
        stopAutoRotate();
        if (!isPaused) {
            startAutoRotate();
        }
    }

    // Enhanced dot click events with debouncing
    let clickTimeout = null;
    quoteDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Debounce rapid clicks
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
            
            clickTimeout = setTimeout(() => {
                if (!isTransitioning) {
                    updateQuote(index);
                    resetAutoRotate();
                }
            }, 100);
        });

        // Keyboard support with enhanced mobile accessibility
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dot.click();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentIndex = parseInt(dot.getAttribute('data-quote'));
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : quotes.length - 1;
                } else {
                    newIndex = currentIndex < quotes.length - 1 ? currentIndex + 1 : 0;
                }
                
                updateQuote(newIndex);
                resetAutoRotate();
                
                // Update focus to the new active dot
                const newDot = document.querySelector(`[data-quote="${newIndex}"]`);
                if (newDot) {
                    newDot.focus();
                }
            }
        });
    });

    // Enhanced hover handling
    if (quotesContainer) {
        quotesContainer.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoRotate();
        });
        
        quotesContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            if (!isPaused) {
                startAutoRotate();
            }
        });

        // Enhanced touch support for mobile
        let touchStartTime = 0;
        let touchMoved = false;
        
        quotesContainer.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchMoved = false;
            isHovered = true;
            stopAutoRotate();
            
            // Prevent default to avoid scrolling issues
            e.preventDefault();
        });
        
        quotesContainer.addEventListener('touchmove', () => {
            touchMoved = true;
        });
        
        quotesContainer.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // If it was a quick tap (not a scroll), don't resume immediately
            if (!touchMoved && touchDuration < 500) {
                setTimeout(() => {
                    isHovered = false;
                    if (!isPaused) {
                        startAutoRotate();
                    }
                }, 3000); // Resume after 3 seconds for quick taps
            } else {
                // For longer touches or scrolls, resume sooner
                setTimeout(() => {
                    isHovered = false;
                    if (!isPaused) {
                        startAutoRotate();
                    }
                }, 1500);
            }
            
            e.preventDefault();
        });
        
        // Handle touch cancellation
        quotesContainer.addEventListener('touchcancel', () => {
            isHovered = false;
            if (!isPaused) {
                startAutoRotate();
            }
        });
    }

    // Pause when page is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isPaused = true;
            stopAutoRotate();
        } else {
            isPaused = false;
            if (!isHovered) {
                startAutoRotate();
            }
        }
    });

    // Handle window resize
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            // Reset transitions on resize to prevent layout issues
            if (quoteBlock) {
                quoteBlock.style.transition = 'none';
                quoteBlock.style.opacity = '1';
                quoteBlock.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    quoteBlock.style.transition = 'all 0.5s ease-in-out';
                }, 50);
            }
        }, 250);
    });

    // Initialize with random quote for variety on each visit
    try {
        // Generate random starting index for variety on each site visit
        const randomStartIndex = Math.floor(Math.random() * quotes.length);
        updateQuote(randomStartIndex, true); // Skip transition on initial load
        startAutoRotate();
    } catch (error) {
        console.error('Rotating quotes initialization error:', error);
    }

    // Cleanup function for potential future use
    window.cleanupRotatingQuotes = () => {
        stopAutoRotate();
        if (clickTimeout) clearTimeout(clickTimeout);
        if (resizeTimeout) clearTimeout(resizeTimeout);
    };
}

// ==============================================
// INITIALIZATION
// ==============================================

function initHeroDropdown() {
    // Button removed; no-op to avoid errors if called
}

function initMobileHeightFixes() {
    // Function to set CSS custom property for mobile height
    function setMobileHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Also set dynamic viewport height if supported
        if (CSS.supports('height', '100dvh')) {
            document.documentElement.style.setProperty('--dvh', '100dvh');
        } else {
            document.documentElement.style.setProperty('--dvh', `${window.innerHeight}px`);
        }
    }
    
    // Set initial height
    setMobileHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setMobileHeight);
    window.addEventListener('orientationchange', () => {
        // Wait for orientation change to complete
        setTimeout(setMobileHeight, 100);
    });
    
    // Update on scroll (for mobile browsers with dynamic toolbars)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                setMobileHeight();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Skills Toggle Function
function toggleMoreSkills() {
    const content = document.getElementById('more-skills-content');
    const icon = document.getElementById('more-skills-icon');
    
    if (content && icon) {
        const isHidden = content.classList.contains('hidden');
        
        if (isHidden) {
            content.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
            trackEvent('skills_expanded', { section: 'technical_skills' });
        } else {
            content.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
            trackEvent('skills_collapsed', { section: 'technical_skills' });
        }
    }
}

function initializeApp() {
    try {
        // Initialize enhanced components
        initNavbar();
        initCarousel();
        initSmoothScrolling();
        initHeroDropdown();
        initMobileHeightFixes();
        initIntersectionObserver();
        initBackToTop();
        initRotatingQuotes();
        
        // Initialize analytics tracking
        initAnalytics();
        
        // Initialize skills toggle
        const toggle = document.querySelector('.more-skills-toggle');
        if (toggle) {
            toggle.addEventListener('click', toggleMoreSkills);
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Fallback initialization after a short delay
setTimeout(() => {
    if (!document.querySelector('.back-to-top')) {
        initializeApp();
    }
}, 1000);

