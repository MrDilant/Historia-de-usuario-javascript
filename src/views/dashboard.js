import { ShellLayout } from '../components/layout.js';
import { initNavbar } from '../components/navbar.js';
import { authService } from '../services/auth.service.js';
import { tasksService } from '../services/tasks.service.js';

export function DashboardView() {
  const currentUser = authService.getCurrentUser() || { name: 'Usuario' };

  const content = `
    <section class="rounded-[2rem] bg-blue-600 dark:bg-slate-900 px-8 py-10 text-white shadow-xl shadow-blue-100 dark:shadow-none transition-colors duration-200">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Dashboard principal</p>
      <h1 class="mt-3 text-4xl font-black tracking-tight">Bienvenida, ${currentUser.name}.</h1>
      <p class="mt-4 max-w-2xl text-blue-50 dark:text-slate-300">Resumen general del trabajo del usuario, accesos rápidos y estado actual de productividad.</p>
    </section>

    <section class="mt-8 grid gap-4 md:grid-cols-3">
      <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200">
        <p class="text-sm text-slate-500 dark:text-slate-400">Tareas activas</p>
        <p id="active-tasks-count" class="mt-3 text-4xl font-black text-blue-700 dark:text-blue-400">0</p>
      </article>
      <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200">
        <p class="text-sm text-slate-500 dark:text-slate-400">Completadas</p>
        <p id="completed-tasks-count" class="mt-3 text-4xl font-black text-blue-700 dark:text-blue-400">0</p>
      </article>
      <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200">
        <p class="text-sm text-slate-500 dark:text-slate-400">Pendientes hoy</p>
        <p id="pending-tasks-count" class="mt-3 text-4xl font-black text-blue-700 dark:text-blue-400">0</p>
      </article>
    </section>

    <section class="mt-8">
      <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Accesos rápidos</h2>
          <a class="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-600 transition" href="/tasks">Ver tareas</a>
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <a class="rounded-3xl bg-blue-50 dark:bg-slate-800 p-5 hover:bg-blue-100 dark:hover:bg-slate-700 transition border border-transparent dark:border-slate-800" href="/task-form">
            <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Crear</p>
            <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Nueva tarea</h3>
          </a>
          <a class="rounded-3xl bg-blue-50 dark:bg-slate-800 p-5 hover:bg-blue-100 dark:hover:bg-slate-700 transition border border-transparent dark:border-slate-800" href="/profile">
            <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Cuenta</p>
            <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Editar perfil</h3>
          </a>
        </div>
      </article>
    </section>
  `;

  return ShellLayout(content);
}

export async function initDashboard() {
  initNavbar();
  
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  try {
    const tasks = await tasksService.getTasks();
    const userTasks = (currentUser.role === 'ADMIN')
      ? tasks
      : tasks.filter(t => t.owner === currentUser.email);

    const activeTasks = userTasks.filter(t => t.status !== 'Completada').length;
    const completedTasks = userTasks.filter(t => t.status === 'Completada').length;
    const pendingTasks = userTasks.filter(t => t.status === 'Pendiente').length;

    const activeEl = document.getElementById('active-tasks-count');
    const completedEl = document.getElementById('completed-tasks-count');
    const pendingEl = document.getElementById('pending-tasks-count');

    if (activeEl) activeEl.textContent = activeTasks;
    if (completedEl) completedEl.textContent = completedTasks;
    if (pendingEl) pendingEl.textContent = pendingTasks;
  } catch (error) {
    console.error('Error calculando estadísticas del dashboard:', error);
  }
}
