import { ShellLayout } from '../components/layout.js';
import { initNavbar } from '../components/navbar.js';
import { AlertComponent } from '../components/alert.js';
import { authService } from '../services/auth.service.js';
import { tasksService } from '../services/tasks.service.js';
import { navigate } from '../router/router.js';
import { swalHelper } from '../utils/swal.js';

let currentTaskId = null;

export function TaskFormView() {
  const content = `
    <section class="rounded-[2rem] border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-50 dark:shadow-none transition-colors duration-200">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Formulario</p>
      <h1 id="form-title" class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Crear o editar tarea</h1>
      <p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">Vista base para registrar una tarea nueva o actualizar una existente.</p>

      <form id="task-form" class="mt-8 grid gap-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="title">Título</label>
          <input id="title" type="text" placeholder="Ej. Preparar proyecto final" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="description">Descripción</label>
          <textarea id="description" rows="5" placeholder="Describe la tarea..." required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition"></textarea>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="status">Estado</label>
            <select id="status" class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none">
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="date">Fecha límite</label>
            <input id="date" type="date" class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none transition" />
          </div>
        </div>

        <div id="form-message-container" class="hidden"></div>

        <div class="flex flex-col gap-3 pt-2 sm:flex-row">
          <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-300 dark:shadow-none transition cursor-pointer">
            Guardar tarea
          </button>
          <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition" href="/tasks">
            Cancelar
          </a>
        </div>
      </form>
    </section>
  `;

  return ShellLayout(content, 'max-w-5xl');
}

export async function initTaskForm(searchParams) {
  initNavbar();
  
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  const form = document.getElementById('task-form');
  const formTitle = document.getElementById('form-title');
  if (!form) return;

  currentTaskId = searchParams ? searchParams.get('id') : null;

  if (currentTaskId) {
    formTitle.textContent = 'Editar tarea';
    const task = await tasksService.getTaskById(currentTaskId);
    if (task) {
      const isAdmin = currentUser.role === 'ADMIN';
      if (!isAdmin && task.owner !== currentUser.email) {
        navigate('/tasks');
        return;
      }

      document.getElementById('title').value = task.title || '';
      document.getElementById('description').value = task.description || '';
      document.getElementById('status').value = task.status || 'Pendiente';
      document.getElementById('date').value = task.date || '';
    }
  } else {
    formTitle.textContent = 'Crear tarea';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const date = document.getElementById('date').value;
    const messageContainer = document.getElementById('form-message-container');

    if (!title || !description) {
      if (messageContainer) {
        messageContainer.innerHTML = AlertComponent('Por favor completa el título y la descripción.', 'error');
        messageContainer.classList.remove('hidden');
      }
      return;
    }

    const taskData = {
      title,
      description,
      status,
      date,
      owner: currentTaskId ? undefined : currentUser.email
    };

    if (currentTaskId) {
      await tasksService.updateTask(currentTaskId, taskData);
      swalHelper.success('¡Tarea actualizada!', 'La tarea se ha modificado correctamente.').then(() => {
        navigate('/tasks');
      });
    } else {
      taskData.owner = currentUser.email;
      await tasksService.createTask(taskData);
      swalHelper.success('¡Tarea creada!', 'La tarea se ha registrado correctamente.').then(() => {
        navigate('/tasks');
      });
    }
  });
}
