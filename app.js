// Annotator App JavaScript with responsive functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize responsive behavior
    initializeResponsiveBehavior();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize interactive components
    initializeComponents();
    
    // Handle window resize events
    window.addEventListener('resize', handleWindowResize);
});

/**
 * Initialize responsive behavior based on Bootstrap 5.x breakpoints
 */
function initializeResponsiveBehavior() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.querySelector('[data-bs-target="#sidebar"]');
    
    // Handle responsive sidebar behavior
    handleSidebarResponsive();
    
    // Update navbar text based on screen size
    updateNavbarResponsive();
}

/**
 * Handle sidebar responsive behavior
 */
function handleSidebarResponsive() {
    const mediaQueries = {
        xs: window.matchMedia('(max-width: 575.98px)'),
        sm: window.matchMedia('(min-width: 576px) and (max-width: 767.98px)'),
        md: window.matchMedia('(min-width: 768px) and (max-width: 991.98px)'),
        lg: window.matchMedia('(min-width: 992px) and (max-width: 1199.98px)'),
        xl: window.matchMedia('(min-width: 1200px) and (max-width: 1399.98px)'),
        xxl: window.matchMedia('(min-width: 1400px)')
    };
    
    function updateLayout() {
        const body = document.body;
        
        // Remove existing breakpoint classes
        body.classList.remove('breakpoint-xs', 'breakpoint-sm', 'breakpoint-md', 'breakpoint-lg', 'breakpoint-xl', 'breakpoint-xxl');
        
        // Add current breakpoint class
        if (mediaQueries.xs.matches) {
            body.classList.add('breakpoint-xs');
            console.log('Current breakpoint: xs (< 576px)');
        } else if (mediaQueries.sm.matches) {
            body.classList.add('breakpoint-sm');
            console.log('Current breakpoint: sm (576px - 767.98px)');
        } else if (mediaQueries.md.matches) {
            body.classList.add('breakpoint-md');
            console.log('Current breakpoint: md (768px - 991.98px)');
        } else if (mediaQueries.lg.matches) {
            body.classList.add('breakpoint-lg');
            console.log('Current breakpoint: lg (992px - 1199.98px)');
        } else if (mediaQueries.xl.matches) {
            body.classList.add('breakpoint-xl');
            console.log('Current breakpoint: xl (1200px - 1399.98px)');
        } else if (mediaQueries.xxl.matches) {
            body.classList.add('breakpoint-xxl');
            console.log('Current breakpoint: xxl (≥ 1400px)');
        }
        
        // Update sidebar behavior based on breakpoint
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            if (mediaQueries.xs.matches || mediaQueries.sm.matches) {
                // On small screens, sidebar should be collapsible
                sidebar.classList.remove('show');
            } else {
                // On larger screens, sidebar should be visible
                sidebar.classList.add('show');
            }
        }
    }
    
    // Initial layout update
    updateLayout();
    
    // Listen for breakpoint changes
    Object.values(mediaQueries).forEach(mq => {
        mq.addListener(updateLayout);
    });
}

/**
 * Update navbar responsive elements
 */
function updateNavbarResponsive() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link span');
    const brandSpan = document.querySelector('.navbar-brand span');
    
    function updateNavbarText() {
        const isLargeScreen = window.matchMedia('(min-width: 992px)').matches;
        const isSmallScreen = window.matchMedia('(max-width: 575.98px)').matches;
        
        // Show/hide navigation text based on screen size
        navLinks.forEach(span => {
            if (isLargeScreen) {
                span.classList.remove('d-none');
                span.classList.add('d-lg-inline');
            } else {
                span.classList.add('d-none');
            }
        });
        
        // Show/hide brand text on very small screens
        if (brandSpan) {
            if (isSmallScreen) {
                brandSpan.classList.add('d-none');
                brandSpan.classList.remove('d-sm-inline');
            } else {
                brandSpan.classList.remove('d-none');
                brandSpan.classList.add('d-sm-inline');
            }
        }
    }
    
    updateNavbarText();
    window.addEventListener('resize', updateNavbarText);
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update page content based on navigation
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                updatePageContent(href.substring(1));
            }
        });
    });
}

/**
 * Initialize interactive components
 */
function initializeComponents() {
    // Initialize tooltips if any
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers if any
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Add click handlers for quick action buttons
    const quickActionButtons = document.querySelectorAll('.card .btn');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log(`Quick action clicked: ${buttonText}`);
            
            // Add visual feedback
            this.classList.add('disabled');
            setTimeout(() => {
                this.classList.remove('disabled');
            }, 1000);
        });
    });
}

/**
 * Handle window resize events
 */
function handleWindowResize() {
    // Debounce resize events
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
        console.log(`Window resized to: ${window.innerWidth}x${window.innerHeight}`);
        
        // Update responsive components
        updateResponsiveComponents();
        
    }, 250);
}

/**
 * Update responsive components on resize
 */
function updateResponsiveComponents() {
    const cards = document.querySelectorAll('.card');
    const screenWidth = window.innerWidth;
    
    // Add responsive classes based on screen width
    cards.forEach(card => {
        if (screenWidth < 576) {
            card.classList.add('card-mobile');
        } else {
            card.classList.remove('card-mobile');
        }
    });
    
    // Update table responsive behavior
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = table.parentNode;
        if (screenWidth < 768) {
            if (!wrapper.classList.contains('table-responsive')) {
                const responsiveDiv = document.createElement('div');
                responsiveDiv.className = 'table-responsive';
                table.parentNode.insertBefore(responsiveDiv, table);
                responsiveDiv.appendChild(table);
            }
        }
    });
}

/**
 * Update page content based on navigation
 */
function updatePageContent(section) {
    const mainContent = document.querySelector('main');
    const pageTitle = mainContent.querySelector('h1');
    
    // Update page title
    switch(section) {
        case 'dashboard':
            pageTitle.textContent = 'Dashboard';
            break;
        case 'annotations':
            pageTitle.textContent = 'Annotations';
            break;
        case 'documentation':
            pageTitle.textContent = 'Documentation';
            break;
        case 'settings':
            pageTitle.textContent = 'Settings';
            break;
        default:
            pageTitle.textContent = 'Dashboard';
    }
    
    console.log(`Navigation changed to: ${section}`);
}

/**
 * Utility function to get current Bootstrap breakpoint
 */
function getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    if (width < 1400) return 'xl';
    return 'xxl';
}

/**
 * Utility function to check if mobile device
 */
function isMobileDevice() {
    return window.innerWidth < 768;
}

/**
 * Export functions for external use
 */
window.AnnotatorApp = {
    getCurrentBreakpoint,
    isMobileDevice,
    updatePageContent
};