export const themeService = {
  getTheme() {
    // 1. Intentar obtener el tema del usuario logueado
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user && user.theme) {
          return user.theme;
        }
      } catch (e) {}
    }
    // 2. Si no hay sesión, usar el tema global guardado o el del sistema
    const globalTheme = localStorage.getItem('global_theme');
    if (globalTheme) return globalTheme;

    // Default al tema del sistema
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  },

  applyTheme() {
    const theme = this.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
  },

  setTheme(theme) {
    // Guardar en la sesión del usuario activo si existe
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const user = JSON.parse(session);
        user.theme = theme;
        localStorage.setItem('user_session', JSON.stringify(user));

        // Guardar también en la base de datos de usuarios
        const usersDb = localStorage.getItem('users_db');
        if (usersDb) {
          const users = JSON.parse(usersDb);
          const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
          if (index !== -1) {
            users[index].theme = theme;
            localStorage.setItem('users_db', JSON.stringify(users));
          }
        }
      } catch (e) {}
    }
    
    // Guardar globalmente para recordar la preferencia
    localStorage.setItem('global_theme', theme);
    this.applyTheme();
  },

  toggleTheme() {
    const current = this.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }
};
