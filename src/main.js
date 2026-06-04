import "./styles/global.css";
import { themeService } from "./services/theme.service.js";
import { handleRouting } from "./router/router.js";

// Limpieza/migración de base de datos local si contiene datos obsoletos de DEVELOPER
try {
  const usersDb = localStorage.getItem('users_db');
  if (usersDb && usersDb.includes('DEVELOPER')) {
    localStorage.removeItem('users_db');
    localStorage.removeItem('user_session');
  }
} catch (e) {}

// Aplicar tema antes de que cargue el DOM para evitar parpadeos
themeService.applyTheme();

window.addEventListener('DOMContentLoaded', () => {
  if (!window.history.state) {
    window.history.replaceState({ index: 0 }, '');
  }
  handleRouting();
});