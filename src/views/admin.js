import { ShellLayout } from '../components/layout.js';
import { initNavbar } from '../components/navbar.js';
import { UserCardComponent } from '../components/user-card.js';
import { authService } from '../services/auth.service.js';
import { usersService } from '../services/users.service.js';
import { swalHelper } from '../utils/swal.js';

export function AdminView() {
  const content = `
    <section class="rounded-[2rem] bg-blue-600 dark:bg-slate-900 px-8 py-10 text-white shadow-xl shadow-blue-100 dark:shadow-none transition-colors duration-200">
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Panel de Control</p>
      <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
      <p class="mt-4 max-w-2xl text-blue-50 dark:text-slate-300">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
    </section>

    <section class="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200 flex flex-col justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Acciones rápidas</h2>
          <div class="mt-5 grid gap-4">
            <a class="rounded-2xl bg-blue-50 dark:bg-slate-800 px-5 py-4 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition" href="/tasks">Ver todas las tareas</a>
            <a class="rounded-2xl bg-blue-50 dark:bg-slate-800 px-5 py-4 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition" href="/dashboard">Volver al dashboard</a>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none transition-colors duration-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Usuarios</h2>
          <span class="rounded-full bg-blue-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300">Usuarios Activos</span>
        </div>
        
        <div id="users-list" class="mt-5 space-y-4">
          <div class="text-center py-6 text-slate-500 dark:text-slate-400 font-semibold">Cargando usuarios...</div>
        </div>
      </article>
    </section>
  `;

  return ShellLayout(content, 'max-w-7xl');
}

export async function initAdmin() {
  initNavbar();

  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') return;

  const usersListContainer = document.getElementById('users-list');
  if (!usersListContainer) return;

  try {
    const users = await usersService.getUsers();

    usersListContainer.innerHTML = users.map(user => {
      const isCurrentUser = user.email === currentUser.email;
      return UserCardComponent(user, isCurrentUser);
    }).join('\n');

    // Asignar eventos de click para cambiar roles
    usersListContainer.querySelectorAll('.btn-change-role').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        const currentRole = btn.getAttribute('data-role');
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

        swalHelper.confirm('¿Cambiar rol?', `¿Deseas cambiar el rol de ${email} a ${newRole}?`, 'Sí, cambiar').then(async (result) => {
          if (result.isConfirmed) {
            await usersService.updateUserRole(email, newRole);
            swalHelper.success('¡Rol actualizado!', `El usuario ahora tiene el rol ${newRole}.`);
            initAdmin(); // Volver a pintar la lista
          }
        });
      });
    });

    // Asignar eventos de click para bloquear/desbloquear usuarios
    usersListContainer.querySelectorAll('.btn-block-user').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        
        swalHelper.confirm('¿Cambiar estado?', `¿Estás seguro de cambiar el estado de bloqueo para el usuario ${email}?`, 'Sí, cambiar').then(async (result) => {
          if (result.isConfirmed) {
            await usersService.toggleUserBlock(email);
            swalHelper.success('¡Estado actualizado!', 'El estado de bloqueo del usuario ha sido modificado.');
            initAdmin(); // Volver a pintar la lista
          }
        });
      });
    });

    // Asignar eventos de click para eliminar usuarios
    usersListContainer.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        
        swalHelper.confirm('¿Eliminar usuario?', `¿Estás COMPLETAMENTE seguro de eliminar al usuario ${email}? Esta acción no se puede deshacer.`, 'Sí, eliminar', true).then(async (result) => {
          if (result.isConfirmed) {
            await usersService.deleteUserAccount(email);
            swalHelper.success('¡Eliminado!', 'El usuario ha sido eliminado correctamente.');
            initAdmin(); // Volver a pintar la lista
          }
        });
      });
    });

  } catch (error) {
    usersListContainer.innerHTML = `<div class="text-center py-6 text-red-600 dark:text-red-400 font-bold">Error al cargar usuarios.</div>`;
  }
}
