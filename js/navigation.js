// Mobile Menu Toggle - Shared across all pages
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.nav-mobile-toggle');
    
    if (menu) {
        const isActive = menu.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        if (toggle) {
            toggle.setAttribute('aria-expanded', isActive.toString());
        }
        menu.setAttribute('aria-hidden', (!isActive).toString());
        
        // Lock/unlock body scroll when menu opens/closes
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    // Click outside to close
    document.addEventListener('click', function(event) {
        const nav = document.getElementById('mainNav');
        const menu = document.getElementById('mobileMenu');
        
        if (menu && menu.classList.contains('active')) {
            // Check if click is outside nav
            if (!nav.contains(event.target)) {
                toggleMobileMenu();
            }
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const menu = document.getElementById('mobileMenu');
            if (menu && menu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Focus trap within mobile menu when open
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                const focusableElements = menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
});

