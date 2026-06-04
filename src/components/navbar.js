import { authService } from '../services/auth.service.js';
import { navigate, handleRouting } from '../router/router.js';
import { themeService } from '../services/theme.service.js';
import { swalHelper } from '../utils/swal.js';

export function NavbarComponent() {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return ''; // No mostrar menú si no hay usuario logueado

  const isAdmin = currentUser.role === 'ADMIN';
  const currentPath = window.location.pathname;

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tareas', path: '/tasks' },
    { name: 'Perfil', path: '/profile' }
  ];

  if (isAdmin) {
    links.push({ name: 'Admin', path: '/admin' });
  }

  const linkElements = links.map(link => {
    const isActive = currentPath === link.path;
    const activeClass = 'rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition shadow-lg shadow-blue-300 dark:shadow-none';
    const inactiveClass = 'rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition';
    return `<a class="${isActive ? activeClass : inactiveClass}" href="${link.path}">${link.name}</a>`;
  }).join('\n');

  const hasHistory = window.history.state && window.history.state.index > 0;
  const backBtnClass = hasHistory ? '' : 'hidden';

  const currentTheme = themeService.getTheme();
  const themeIcon = currentTheme === 'dark'
    ? `<svg class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
         <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
       </svg>`
    : `<svg class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
         <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
       </svg>`;

  const themeBtnTitle = currentTheme === 'dark' ? 'Modo claro' : 'Modo oscuro';

  return `
    <header class="border-b border-blue-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <button id="btn-back" class="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer ${backBtnClass}" title="Regresar">
            <svg class="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <a class="text-xl font-black tracking-tight text-blue-900 dark:text-blue-400 flex items-center gap-2" href="/dashboard">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>TaskFlowSPA</span>
          </a>
        </div>
        
        <nav class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-1">
            ${linkElements}
          </div>
          
          <button id="btn-theme" class="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="${themeBtnTitle}">
            ${themeIcon}
          </button>

          <button id="btn-logout" class="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer">
            Salir
          </button>
        </nav>
      </div>
    </header>
  `;
}

export function initNavbar() {
  document.getElementById('btn-back')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
  });

  document.getElementById('btn-theme')?.addEventListener('click', (e) => {
    e.preventDefault();
    themeService.toggleTheme();
    handleRouting();
  });

  document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    swalHelper.confirm('¿Cerrar sesión?', '¿Estás seguro de que deseas salir de tu cuenta?', 'Sí, salir', true).then((result) => {
      if (result.isConfirmed) {
        authService.logout();
        navigate('/');
      }
    });
  });
}
