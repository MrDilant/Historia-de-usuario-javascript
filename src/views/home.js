import { themeService } from '../services/theme.service.js';
import { handleRouting } from '../router/router.js';

export function HomeView() {
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
    <div class="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 flex flex-col transition-colors duration-200">
      <header class="border-b border-blue-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-50 transition-colors duration-200">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a class="text-xl font-black tracking-tight text-blue-900 dark:text-blue-400 flex items-center gap-2" href="/">
            <svg class="h-6 w-6 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>TaskFlowSPA</span>
          </a>
          <nav class="flex items-center gap-3">
            <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition" href="/">Inicio</a>
            <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 transition" href="/login">Ingresar</a>
            <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-300 dark:shadow-none transition" href="/register">Registrarse</a>
            <button id="btn-theme-home" class="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="${themeBtnTitle}">
              ${themeIcon}
            </button>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-6 py-14 flex-1 flex flex-col justify-center">
        <section class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p class="inline-flex rounded-full bg-blue-100 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 border border-transparent dark:border-slate-700">Organiza tu trabajo con calma</p>
            <h1 class="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl leading-[1.1]">
              Una plataforma clara para gestionar tareas, usuarios y productividad.
            </h1>
            <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              TaskFlowSPA presenta el recorrido principal del proyecto con una interfaz uniforme, amable y lista para convertirse
              luego en una SPA real con autenticación, roles, permisos y CRUD de tareas.
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-300 dark:shadow-none hover:bg-blue-500 transition" href="/login">Iniciar sesión</a>
              <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition" href="/register">Crear cuenta</a>
            </div>
          </div>

          <section class="rounded-[2rem] border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-100/70 dark:shadow-none transition-colors duration-200">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Vistas del proyecto</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-2">
              <a class="rounded-3xl bg-sky-50 dark:bg-slate-800 p-5 hover:bg-sky-100 dark:hover:bg-slate-700 transition border border-transparent dark:border-slate-800" href="/dashboard">
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Dashboard</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Resumen principal de productividad.</p>
              </a>
              <a class="rounded-3xl bg-sky-50 dark:bg-slate-800 p-5 hover:bg-sky-100 dark:hover:bg-slate-700 transition border border-transparent dark:border-slate-800" href="/tasks">
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Mis tareas</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">CRUD principal del usuario.</p>
              </a>
              <a class="rounded-3xl bg-sky-50 dark:bg-slate-800 p-5 hover:bg-sky-100 dark:hover:bg-slate-700 transition border border-transparent dark:border-slate-800" href="/profile">
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Mi perfil</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Actualizar cuenta y datos personales.</p>
              </a>
              <a class="rounded-3xl bg-sky-50 dark:bg-slate-800 p-5 hover:bg-sky-100 dark:hover:bg-slate-700 transition border border-transparent dark:border-slate-800" href="/admin">
                <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Admin</p>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Gestión de usuarios y roles.</p>
              </a>
            </div>
          </section>
        </section>
      </main>
    </div>
  `;
}

export function initHome() {
  document.getElementById('btn-theme-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    themeService.toggleTheme();
    handleRouting();
  });
}
