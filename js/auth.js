// Authentication handling for frontend
// Manages login, signup, and authentication state

// Check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

// Get current user from API
async function getCurrentUser() {
  if (!isAuthenticated()) {
    return null;
  }

  try {
    const response = await window.API?.auth?.getCurrentUser();
    return response?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user has paid access
async function hasPaidAccess() {
  const user = await getCurrentUser();
  return user?.subscriptionStatus === 'active' && user?.subscriptionTier !== 'free';
}

// Login handler
async function handleLogin(email, password, rememberMe = false) {
  try {
    const response = await window.API.auth.login(email, password, rememberMe);
    
    if (response.user) {
      // Update UI to show logged in state
      updateAuthUI(response.user);
      
      // Show success message
      showNotification('Login successful!', 'success');
      
      return response;
    }
    
    throw new Error('Login failed');
  } catch (error) {
    console.error('Login error:', error);
    showNotification(error.message || 'Login failed', 'error');
    throw error;
  }
}

// Register handler
async function handleRegister(email, password, firstName, lastName) {
  try {
    const response = await window.API.auth.register(email, password, firstName, lastName);
    
    if (response.user) {
      updateAuthUI(response.user);
      showNotification('Registration successful! Please check your email for verification.', 'success');
      return response;
    }
    
    throw new Error('Registration failed');
  } catch (error) {
    console.error('Registration error:', error);
    showNotification(error.message || 'Registration failed', 'error');
    throw error;
  }
}

// Logout handler
function handleLogout() {
  window.API.auth.logout();
  updateAuthUI(null);
  showNotification('Logged out successfully', 'success');
  
  // Redirect to home page
  if (window.location.pathname.includes('members')) {
    window.location.href = '/index.html';
  }
}

// Update UI based on authentication state
function updateAuthUI(user) {
  const loginButton = document.getElementById('login-button');
  const signupButton = document.getElementById('signup-button');
  const logoutButton = document.getElementById('logout-button');
  const userMenu = document.getElementById('user-menu');
  const membersLink = document.getElementById('nav-members');

  if (user) {
    // User is logged in
    if (loginButton) loginButton.style.display = 'none';
    if (signupButton) signupButton.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'block';
    if (userMenu) {
      userMenu.style.display = 'block';
      const userName = userMenu.querySelector('.user-name');
      if (userName) {
        userName.textContent = user.firstName || user.email;
      }
    }
    if (membersLink) membersLink.style.display = 'block';
    
    // Check paid access and update UI
    if (user.subscriptionStatus === 'active') {
      enablePaidFeatures();
    }
  } else {
    // User is not logged in
    if (loginButton) loginButton.style.display = 'block';
    if (signupButton) signupButton.style.display = 'block';
    if (logoutButton) logoutButton.style.display = 'none';
    if (userMenu) userMenu.style.display = 'none';
    if (membersLink) membersLink.style.display = 'none';
  }
}

// Show notification (simple implementation)
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize auth state on page load
async function initAuth() {
  if (isAuthenticated()) {
    try {
      const user = await getCurrentUser();
      if (user) {
        updateAuthUI(user);
      } else {
        // Token is invalid, clear it
        handleLogout();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      handleLogout();
    }
  } else {
    updateAuthUI(null);
  }
}

// Export functions
window.Auth = {
  isAuthenticated,
  getCurrentUser,
  hasPaidAccess,
  handleLogin,
  handleRegister,
  handleLogout,
  updateAuthUI,
  initAuth
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}


