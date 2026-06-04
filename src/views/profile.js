import { ShellLayout } from '../components/layout.js';
import { initNavbar } from '../components/navbar.js';
import { AlertComponent } from '../components/alert.js';
import { authService } from '../services/auth.service.js';
import { usersService } from '../services/users.service.js';
import { navigate } from '../router/router.js';
import { swalHelper } from '../utils/swal.js';

export function ProfileView() {
  const currentUser = authService.getCurrentUser() || { name: '', email: '', role: 'USER' };

  const asideBgClass = 'bg-blue-600 dark:bg-slate-900 shadow-xl shadow-blue-100 dark:shadow-none';

  const deleteButtonHtml = `<button type="button" id="btn-delete-account" class="inline-flex items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition cursor-pointer">
        Eliminar mi cuenta
       </button>`;

  const content = `
    <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <aside class="${asideBgClass} rounded-[2rem] p-8 text-white flex flex-col justify-between transition-colors duration-200">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-slate-300">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50 dark:text-slate-300">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </div>
        <div class="mt-8 pt-6 border-t border-blue-500/50 dark:border-slate-800">
          <p class="text-xs text-blue-200 dark:text-slate-400">Rol actual</p>
          <p class="text-lg font-bold uppercase tracking-wider">${currentUser.role}</p>
        </div>
      </aside>

      <section class="rounded-[2rem] border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-50 dark:shadow-none transition-colors duration-200">
        <form id="profile-form" class="grid gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="name">Nombre Completo</label>
            <input id="name" type="text" value="${currentUser.name}" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none transition" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="profile-email">Correo</label>
            <input id="profile-email" type="email" value="${currentUser.email}" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none transition" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="password-new">Nueva contraseña</label>
            <input id="password-new" type="password" placeholder="Actualiza tu contraseña" class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
          </div>

          <div id="profile-message-container" class="hidden"></div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-300 dark:shadow-none transition cursor-pointer">
              Guardar cambios
            </button>
            ${deleteButtonHtml}
          </div>
        </form>
      </section>
    </section>
  `;

  return ShellLayout(content, 'max-w-5xl');
}

export function initProfile() {
  initNavbar();
  
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  const form = document.getElementById('profile-form');
  const deleteBtn = document.getElementById('btn-delete-account');
  const messageContainer = document.getElementById('profile-message-container');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('profile-email').value;

      if (!name || !email) {
        if (messageContainer) {
          messageContainer.innerHTML = AlertComponent('Por favor completa todos los campos.', 'error');
          messageContainer.classList.remove('hidden');
        }
        return;
      }

      const updated = await usersService.updateUserProfile(currentUser.email, { name, email });
      if (updated) {
        if (messageContainer) {
          messageContainer.innerHTML = AlertComponent('Perfil actualizado con éxito.', 'success');
          messageContainer.classList.remove('hidden');
        }
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      swalHelper.confirm(
        '¿Estás COMPLETAMENTE seguro?',
        'Esta acción eliminará tu cuenta de inmediato y de forma permanente. Se cerrará tu sesión.',
        'Sí, eliminar cuenta',
        true
      ).then(async (result) => {
        if (result.isConfirmed) {
          await usersService.deleteUserAccount(currentUser.email);
          swalHelper.success('Cuenta eliminada', 'Tu cuenta ha sido eliminada con éxito.').then(() => {
            navigate('/');
          });
        }
      });
    });
  }
}
