// Mobile Menu Toggle - Shared across all pages
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const nav = document.getElementById('mainNav');
        const toggle = document.querySelector('.nav-mobile-toggle');
        const menu = document.getElementById('mobileMenu');
        
        if (menu && menu.classList.contains('active')) {
            // Check if click is outside nav
            if (!nav.contains(event.target)) {
                menu.classList.remove('active');
            }
        }
    });
});

