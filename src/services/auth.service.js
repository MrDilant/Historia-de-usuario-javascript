export const authService = {
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user_session');
      if (!user) return null;

      const parsedUser = JSON.parse(user);

      // Validar si el usuario sigue existiendo y no está bloqueado
      const localUsers = localStorage.getItem('users_db');
      if (localUsers) {
        const dbUsers = JSON.parse(localUsers);
        const dbUser = dbUsers.find(u => u.email.toLowerCase() === parsedUser.email.toLowerCase());
        if (!dbUser || dbUser.blocked) {
          localStorage.removeItem('user_session');
          return null;
        }
      }

      return parsedUser;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'ADMIN';
  },

  login(email, password) {
    let users = [];
    try {
      const localUsers = localStorage.getItem('users_db');
      if (localUsers) {
        users = JSON.parse(localUsers);
      } else {
        users = [
          { name: 'Ana Torres', email: 'ana@taskflow.com', role: 'USER', blocked: false, theme: 'light' },
          { name: 'Carlos Ruiz', email: 'carlos@taskflow.com', role: 'ADMIN', blocked: false, theme: 'light' },
          { name: 'Sofía López', email: 'sofia@taskflow.com', role: 'USER', blocked: false, theme: 'light' },
          { name: 'Diana Prince', email: 'diana@taskflow.com', role: 'ADMIN', blocked: false, theme: 'light' }
        ];
        localStorage.setItem('users_db', JSON.stringify(users));
      }
    } catch (e) {
      console.warn('Error al obtener la base de usuarios.');
    }

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      throw new Error('El correo electrónico no está registrado.');
    }

    if (foundUser.blocked) {
      throw new Error('Tu cuenta ha sido bloqueada por un administrador.');
    }

    localStorage.setItem('user_session', JSON.stringify(foundUser));
    
    // Aplicar tema del usuario logueado
    const themeToApply = foundUser.theme || 'light';
    localStorage.setItem('global_theme', themeToApply);
    if (themeToApply === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }

    return foundUser;
  },

  register(name, lastname, email, password, role = 'USER') {
    let users = [];
    try {
      const localUsers = localStorage.getItem('users_db');
      if (localUsers) {
        users = JSON.parse(localUsers);
      } else {
        users = [
          { name: 'Ana Torres', email: 'ana@taskflow.com', role: 'USER', blocked: false, theme: 'light' },
          { name: 'Carlos Ruiz', email: 'carlos@taskflow.com', role: 'ADMIN', blocked: false, theme: 'light' },
          { name: 'Sofía López', email: 'sofia@taskflow.com', role: 'USER', blocked: false, theme: 'light' },
          { name: 'Diana Prince', email: 'diana@taskflow.com', role: 'ADMIN', blocked: false, theme: 'light' }
        ];
        localStorage.setItem('users_db', JSON.stringify(users));
      }
    } catch (e) {
      console.warn('Error al obtener la base de usuarios.');
    }

    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    const currentTheme = localStorage.getItem('global_theme') || 'light';
    const newUser = {
      name: `${name} ${lastname}`,
      email,
      role,
      blocked: false,
      theme: currentTheme
    };

    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    localStorage.setItem('user_session', JSON.stringify(newUser));

    return newUser;
  },

  logout() {
    localStorage.removeItem('user_session');
  }
};

