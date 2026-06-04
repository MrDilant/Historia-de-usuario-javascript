const DEFAULT_USERS = [
  { name: 'Ana Torres', email: 'ana@taskflow.com', role: 'USER', blocked: false, theme: 'light' },
  { name: 'Carlos Ruiz', email: 'carlos@taskflow.com', role: 'ADMIN', blocked: false, theme: 'light' },
  { name: 'Sofía López', email: 'sofia@taskflow.com', role: 'USER', blocked: false, theme: 'light' },
  { name: 'Diana Prince', email: 'diana@taskflow.com', role: 'ADMIN', blocked: false, theme: 'light' }
];

export const usersService = {
  async getUsers() {
    try {
      let users = localStorage.getItem('users_db');
      if (!users) {
        localStorage.setItem('users_db', JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(users);
    } catch (e) {
      console.warn('Error al obtener usuarios de db.');
      return DEFAULT_USERS;
    }
  },

  async updateUserRole(email, newRole) {
    try {
      const users = await this.getUsers();
      const index = users.findIndex(u => u.email === email);
      if (index !== -1) {
        users[index].role = newRole;
        localStorage.setItem('users_db', JSON.stringify(users));
        
        // Si el usuario modificado es el actual, actualiza su sesión
        const session = localStorage.getItem('user_session');
        if (session) {
          const currentUser = JSON.parse(session);
          if (currentUser.email === email) {
            currentUser.role = newRole;
            localStorage.setItem('user_session', JSON.stringify(currentUser));
          }
        }
        return users[index];
      }
    } catch (e) {
      console.warn('Error al actualizar rol del usuario.');
    }
    return null;
  },

  async toggleUserBlock(email) {
    try {
      const users = await this.getUsers();
      const index = users.findIndex(u => u.email === email);
      if (index !== -1) {
        users[index].blocked = !users[index].blocked;
        localStorage.setItem('users_db', JSON.stringify(users));

        // Si el usuario bloqueado es el actual, cerrar su sesión
        const session = localStorage.getItem('user_session');
        if (session) {
          const currentUser = JSON.parse(session);
          if (currentUser.email === email && users[index].blocked) {
            localStorage.removeItem('user_session');
          }
        }
        return users[index];
      }
    } catch (e) {
      console.warn('Error al bloquear/desbloquear usuario.');
    }
    return null;
  },

  async updateUserProfile(email, updatedData) {
    try {
      // Actualizar en db general
      const users = await this.getUsers();
      const index = users.findIndex(u => u.email === email);
      if (index !== -1) {
        users[index].name = updatedData.name;
        users[index].email = updatedData.email;
        localStorage.setItem('users_db', JSON.stringify(users));
      }

      // Actualizar sesión activa
      const session = localStorage.getItem('user_session');
      if (session) {
        const user = JSON.parse(session);
        if (user.email === email) {
          const newUser = {
            ...user,
            name: updatedData.name,
            email: updatedData.email
          };
          localStorage.setItem('user_session', JSON.stringify(newUser));
          return newUser;
        }
      }
    } catch (e) {
      console.warn('Error al actualizar perfil.');
    }
    return null;
  },

  async deleteUserAccount(email) {
    try {
      // Eliminar de db general
      const users = await this.getUsers();
      const targetUser = users.find(u => u.email === email);
      const filtered = users.filter(u => u.email !== email);
      localStorage.setItem('users_db', JSON.stringify(filtered));

      // Limpiar sesión local solo si el usuario eliminado es la sesión activa
      const session = localStorage.getItem('user_session');
      if (session) {
        const currentUser = JSON.parse(session);
        if (currentUser.email === email) {
          localStorage.removeItem('user_session');
        }
      }
      return true;
    } catch (e) {
      console.warn('Error al eliminar cuenta.');
    }
    return false;
  }
};

