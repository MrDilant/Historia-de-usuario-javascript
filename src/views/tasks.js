import { ShellLayout } from '../components/layout.js';
import { initNavbar } from '../components/navbar.js';
import { TaskCardComponent } from '../components/task-card.js';
import { authService } from '../services/auth.service.js';
import { tasksService } from '../services/tasks.service.js';
import { navigate } from '../router/router.js';
import { swalHelper } from '../utils/swal.js';

export function TasksView() {
  const content = `
    <section class="flex flex-col gap-4 rounded-[2rem] bg-blue-600 dark:bg-slate-900 px-8 py-10 text-white md:flex-row md:items-end md:justify-between shadow-xl shadow-blue-100 dark:shadow-none transition-colors duration-200">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">CRUD de tareas</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Mis tareas</h1>
        <p class="mt-4 max-w-2xl text-blue-50 dark:text-slate-300">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
      </div>
      <a class="inline-flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer border border-transparent dark:border-slate-750" href="/task-form">
        Crear tarea
      </a>
    </section>

    <section id="tasks-list" class="mt-8 grid gap-4">
      <div class="text-center py-10 text-slate-500 dark:text-slate-400 font-semibold">Cargando tareas...</div>
    </section>
  `;

  return ShellLayout(content);
}

export async function initTasks() {
  initNavbar();
  
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  const tasksListContainer = document.getElementById('tasks-list');
  if (!tasksListContainer) return;

  try {
    const tasks = await tasksService.getTasks();
    
    const isAdmin = currentUser.role === 'ADMIN';

    // El USER solo manipula sus propias tareas, el ADMIN ve todas
    const filteredTasks = isAdmin 
      ? tasks 
      : tasks.filter(t => t.owner === currentUser.email);

    if (filteredTasks.length === 0) {
      tasksListContainer.innerHTML = `
        <div class="rounded-3xl border border-dashed border-blue-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200">
          <p class="text-lg font-bold text-slate-700 dark:text-slate-300">No hay tareas creadas</p>
          <p class="text-slate-500 dark:text-slate-400 mt-2">Crea tu primera tarea para empezar a organizar tu tiempo.</p>
          <a href="/task-form" class="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-300 dark:shadow-none transition">Crear tarea</a>
        </div>
      `;
      return;
    }

    const showOwner = isAdmin;
    tasksListContainer.innerHTML = filteredTasks
      .map(task => TaskCardComponent(task, showOwner))
      .join('\n');

    // Asignar eventos a los botones
    tasksListContainer.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        navigate(`/task-form?id=${id}`);
      });
    });

    tasksListContainer.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        
        swalHelper.confirm('¿Estás seguro?', 'Esta acción eliminará la tarea permanentemente.', 'Sí, eliminar', true).then(async (result) => {
          if (result.isConfirmed) {
            await tasksService.deleteTask(id);
            swalHelper.success('¡Eliminada!', 'La tarea ha sido eliminada.');
            initTasks(); // Recargar listado
          }
        });
      });
    });

  } catch (error) {
    tasksListContainer.innerHTML = `<div class="text-center py-10 text-red-600 dark:text-red-400 font-bold">Error al cargar tareas.</div>`;
  }
}
