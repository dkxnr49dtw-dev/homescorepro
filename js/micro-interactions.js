/**
 * Micro-interactions and animations
 * Provides smooth transitions, animations, and feedback for user actions
 */

class MicroInteractions {
    /**
     * Animate number count-up
     */
    static animateNumber(start, end, duration, callback) {
        const startTime = performance.now();
        const range = end - start;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (range * eased);
            
            callback(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                callback(end);
            }
        }
        
        requestAnimationFrame(update);
    }

    /**
     * Animate score display with count-up
     */
    static animateScore(element, targetScore, duration = 1500) {
        if (!element) return;
        
        const startScore = parseFloat(element.textContent) || 0;
        if (isNaN(startScore)) {
            element.textContent = targetScore.toFixed(1);
            return;
        }
        
        this.animateNumber(startScore, targetScore, duration, (value) => {
            element.textContent = value.toFixed(1);
        });
    }

    /**
     * Show save animation with toast
     */
    static animateSave(button, itemName) {
        if (!button) return;
        
        // Add saving class
        button.classList.add('saving');
        button.disabled = true;
        
        // Animate button
        setTimeout(() => {
            button.classList.remove('saving');
            button.classList.add('saved');
            
            // Show toast notification
            if (typeof UIManager !== 'undefined' && UIManager.showSuccess) {
                UIManager.showSuccess(`✓ ${itemName} saved to your list`);
            }
            
            // Reset button state after animation
            setTimeout(() => {
                button.classList.remove('saved');
                button.disabled = false;
            }, 2000);
        }, 300);
    }

    /**
     * Show loading state with spinner
     */
    static showLoading(element, message = 'Loading...') {
        if (!element) return;
        
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.classList.add('loading-state');
        element.innerHTML = `
            <div class="loading-spinner"></div>
            <span class="loading-message">${message}</span>
        `;
    }

    /**
     * Hide loading state
     */
    static hideLoading(element) {
        if (!element) return;
        
        element.classList.remove('loading-state');
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        }
    }

    /**
     * Pulse animation for important elements
     */
    static pulse(element, duration = 1000) {
        if (!element) return;
        
        element.classList.add('pulse-animation');
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, duration);
    }

    /**
     * Shake animation for errors
     */
    static shake(element) {
        if (!element) return;
        
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.MicroInteractions = MicroInteractions;
}



