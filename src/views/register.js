import { authService } from '../services/auth.service.js';
import { AlertComponent } from '../components/alert.js';
import { navigate } from '../router/router.js';

export function RegisterView() {
  return `
    <div class="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 flex flex-col justify-between transition-colors duration-200">
      <main class="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr] flex-1">
        <section class="hidden border-r border-blue-100 dark:border-slate-800 bg-blue-600 dark:bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between transition-colors duration-200">
          <a class="text-xl font-black tracking-tight flex items-center gap-2" href="/">
            <svg class="h-6 w-6 text-blue-100 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>TaskFlowSPA</span>
          </a>
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Nuevo usuario</p>
            <h1 class="mt-4 text-5xl font-black tracking-tight leading-[1.1] text-white dark:text-slate-100">Crea tu cuenta y empieza a organizar tu flujo.</h1>
            <p class="mt-5 max-w-md text-lg leading-8 text-blue-50 dark:text-slate-300">
              Esta vista permite enseñar el registro como parte del alcance funcional antes de llevarlo al flujo SPA definitivo.
            </p>
          </div>
          <p class="text-sm text-blue-100 dark:text-slate-400">Interfaz base del módulo de autenticación.</p>
        </section>

        <section class="flex items-center justify-center px-6 py-10">
          <div class="w-full max-w-xl rounded-[2rem] border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-100/70 dark:shadow-none transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Registro</p>
                <h2 class="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">Crear cuenta</h2>
              </div>
              <a class="rounded-full border border-blue-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition" href="/login">Ya tengo cuenta</a>
            </div>

            <form id="register-form" class="mt-8 grid gap-5">
              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-name">Nombre</label>
                  <input id="register-name" type="text" placeholder="Ana" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-lastname">Apellido</label>
                  <input id="register-lastname" type="text" placeholder="Torres" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-email">Correo</label>
                <input id="register-email" type="email" placeholder="usuario@taskflow.com" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
              </div>

              <div class="grid gap-5 md:grid-cols-3">
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-password">Contraseña</label>
                  <input id="register-password" type="password" placeholder="Contraseña" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-gender">Género</label>
                  <select id="register-gender" class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none">
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="register-role">Rol</label>
                  <select id="register-role" class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-blue-400 focus:outline-none">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div id="register-message-container" class="hidden"></div>

              <button type="submit" class="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-300 dark:shadow-none transition cursor-pointer">
                Registrarme
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  `;
}

export function initRegister() {
  const form = document.getElementById('register-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const lastname = document.getElementById('register-lastname').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const role = document.getElementById('register-role').value;
      const messageContainer = document.getElementById('register-message-container');

      if (!name || !lastname || !email || !password) {
        if (messageContainer) {
          messageContainer.innerHTML = AlertComponent('Por favor completa todos los campos.', 'error');
          messageContainer.classList.remove('hidden');
        }
        return;
      }

      try {
        await authService.register(name, lastname, email, password, role);
        navigate('/dashboard');
      } catch (error) {
        if (messageContainer) {
          messageContainer.innerHTML = AlertComponent(error.message, 'error');
          messageContainer.classList.remove('hidden');
        }
      }
    });
  }
}
