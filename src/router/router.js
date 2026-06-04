import { authService } from '../services/auth.service.js';

// Importar vistas JS
import { HomeView, initHome } from '../views/home.js';
import { LoginView, initLogin } from '../views/login.js';
import { RegisterView, initRegister } from '../views/register.js';
import { DashboardView, initDashboard } from '../views/dashboard.js';
import { TasksView, initTasks } from '../views/tasks.js';
import { TaskFormView, initTaskForm } from '../views/task-form.js';
import { ProfileView, initProfile } from '../views/profile.js';
import { AdminView, initAdmin } from '../views/admin.js';
import { NotFoundView, initNotFound } from '../views/not-found.js';

const routes = [
  { path: '/', view: HomeView, init: initHome, public: true },
  { path: '/login', view: LoginView, init: initLogin, public: true, guestOnly: true },
  { path: '/register', view: RegisterView, init: initRegister, public: true, guestOnly: true },
  { path: '/dashboard', view: DashboardView, init: initDashboard, private: true },
  { path: '/tasks', view: TasksView, init: initTasks, private: true },
  { path: '/task-form', view: TaskFormView, init: initTaskForm, private: true },
  { path: '/profile', view: ProfileView, init: initProfile, private: true },
  { path: '/admin', view: AdminView, init: initAdmin, private: true, role: 'ADMIN' },
  { path: '/404', view: NotFoundView, init: initNotFound, public: true }
];

export function navigate(path) {
  const currentIndex = (window.history.state && window.history.state.index) || 0;
  window.history.pushState({ index: currentIndex + 1 }, '', path);
  handleRouting();
}

export function handleRouting() {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  
  let route = routes.find(r => r.path === path);

  if (!route) {
    route = routes.find(r => r.path === '/404');
  }

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Guard: Solo para usuarios sin sesión (Login/Registro) -> Redirigir al dashboard si ya inició sesión
  if (route.guestOnly && isAuthenticated) {
    navigate('/dashboard');
    return;
  }

  // Guard: Ruta privada -> Redirigir al home (o login) si no hay sesión activa
  if (route.private && !isAuthenticated) {
    navigate('/login');
    return;
  }

  // Guard: Restricción por rol (ej. Panel de Admin para administradores)
  if (route.role) {
    const isAdmin = currentUser && currentUser.role === 'ADMIN';
    
    if (route.role === 'ADMIN' && !isAdmin) {
      navigate('/dashboard');
      return;
    } else if (route.role !== 'ADMIN' && (!currentUser || currentUser.role !== route.role)) {
      navigate('/dashboard');
      return;
    }
  }

  // Renderizar la vista
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = route.view();
    
    // Ejecutar lógica inicial del componente con parámetros de búsqueda si existen
    if (route.init) {
      route.init(searchParams);
    }
  }

  // Interceptar enlaces para mantener navegación SPA
  setupLinkInterceptions();
}

function setupLinkInterceptions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    
    // Interceptar solo rutas relativas locales (y evitar duplicar eventos)
    if (href.startsWith('/') && !link.dataset.navigated) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(href);
      });
      link.dataset.navigated = "true";
    }
  });
}

// Escuchar retroceder/avanzar en el historial del navegador
window.addEventListener('popstate', handleRouting);
