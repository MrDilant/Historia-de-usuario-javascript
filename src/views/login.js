import { authService } from '../services/auth.service.js';
import { AlertComponent } from '../components/alert.js';
import { navigate } from '../router/router.js';

export function LoginView() {
  return `
    <div class="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 flex flex-col justify-between transition-colors duration-200">
      <main class="grid min-h-screen lg:grid-cols-[1fr_0.95fr] flex-1">
        <section class="flex items-center justify-center px-6 py-10">
          <div class="w-full max-w-xl rounded-[2rem] border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-blue-100/70 dark:shadow-none transition-colors duration-200">
            <div class="flex items-center justify-between">
              <a class="text-xl font-black tracking-tight text-blue-900 dark:text-blue-400 flex items-center gap-2" href="/">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>TaskFlowSPA</span>
              </a>
              <a class="rounded-full border border-blue-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition" href="/register">Registrarse</a>
            </div>

            <div class="mt-8">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Inicio de sesión</p>
              <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Bienvenido de nuevo</h1>
              <p class="mt-4 text-slate-600 dark:text-slate-400">Ingresa a tu espacio de trabajo y continúa organizando tus tareas.</p>
            </div>

            <form id="login-form" class="mt-8 grid gap-5">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="email">Correo</label>
                <input id="email" type="email" placeholder="usuario@taskflow.com" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Usa tu correo registrado. Si contiene "admin", ingresarás como ADMIN.</p>
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="password">Contraseña</label>
                <input id="password" type="password" placeholder="Ingresa tu contraseña" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition" />
              </div>
              
              <div id="login-message-container" class="hidden"></div>
              
              <button type="submit" class="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-300 dark:shadow-none transition cursor-pointer">
                Entrar al dashboard
              </button>
            </form>
          </div>
        </section>

        <section class="hidden bg-blue-600 dark:bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-center transition-colors duration-200">
          <div class="mx-auto max-w-lg">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">TaskFlowSPA</p>
            <h2 class="mt-4 text-5xl font-black tracking-tight leading-[1.1] text-white dark:text-slate-100">Una experiencia limpia para aprender una primera SPA.</h2>
            <ul class="mt-8 space-y-4 text-lg leading-8 text-blue-50 dark:text-slate-300 list-disc list-inside">
              <li>Autenticación simplificada con localStorage.</li>
              <li>Gestión de tareas con enfoque claro y visual.</li>
              <li>Roles y permisos entendibles desde el primer recorrido.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  `;
}

export function initLogin() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageContainer = document.getElementById('login-message-container');

      if (!email || !password) {
        if (messageContainer) {
          messageContainer.innerHTML = AlertComponent('Por favor completa todos los campos.', 'error');
          messageContainer.classList.remove('hidden');
        }
        return;
      }

      try {
        authService.login(email, password);
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
