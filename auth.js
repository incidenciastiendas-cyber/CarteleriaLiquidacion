// auth.js - Sistema de autenticación local

// Verificar si el usuario ya está autenticado
function isAuthenticated() {
  const session = localStorage.getItem('carteleriaSession');
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      // Verificar que la sesión no haya expirado (7 días)
      const sessionDate = new Date(sessionData.timestamp);
      const now = new Date();
      const daysDiff = (now - sessionDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 7) {
        logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

// Obtener datos del usuario actual
function getCurrentUser() {
  const session = localStorage.getItem('carteleriaSession');
  if (session) {
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Intentar login
function login(username, password, rememberMe) {
  const user = authorizedUsers.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    const sessionData = {
      username: user.username,
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString()
    };
    
    // Guardar sesión
    localStorage.setItem('carteleriaSession', JSON.stringify(sessionData));
    
    // Si marcó "Mantener conectado", guardar credenciales
    if (rememberMe) {
      localStorage.setItem('carteleriaRemember', JSON.stringify({
        username: username,
        timestamp: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem('carteleriaRemember');
    }
    
    return { success: true, user: sessionData };
  }
  
  return { success: false, message: 'Usuario o contraseña incorrectos' };
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('carteleriaSession');
  // No eliminamos carteleriaRemember para mantener el usuario recordado
  window.location.href = 'index.html';
}

// Obtener usuario recordado (solo username)
function getRememberedUser() {
  const remembered = localStorage.getItem('carteleriaRemember');
  if (remembered) {
    try {
      const data = JSON.parse(remembered);
      return data.username;
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Proteger página (redirigir a login si no está autenticado)
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

// Redirigir a home si ya está autenticado (para la página de login)
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = 'home.html';
  }
}
