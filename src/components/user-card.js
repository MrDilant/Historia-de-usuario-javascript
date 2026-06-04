import { authService } from '../services/auth.service.js';

export function UserCardComponent(user, isCurrentUser = false) {
  const currentUser = authService.getCurrentUser();
  const isCurrentAdmin = currentUser && currentUser.role === 'ADMIN';

  const roleBadge = user.role === 'ADMIN'
    ? '<span class="rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">ADMIN</span>'
    : '<span class="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50">USER</span>';

  const blockedBadge = user.blocked
    ? '<span class="rounded-full bg-red-100 dark:bg-red-950/40 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">BLOQUEADO</span>'
    : '';

  let actionButtons = '';
  if (isCurrentUser) {
    actionButtons = `<span class="text-xs text-slate-400 dark:text-slate-500 font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-full">Tú (Actual)</span>`;
  } else {
    const blockBtnText = user.blocked ? 'Desbloquear' : 'Bloquear';
    const blockBtnClass = user.blocked 
      ? 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' 
      : 'border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20';

    actionButtons = `
      <div class="flex flex-wrap gap-2">
        <button class="btn-change-role rounded-full border border-blue-200 dark:border-blue-900/50 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer" data-email="${user.email}" data-role="${user.role}">
          Cambiar rol
        </button>
        <button class="btn-block-user rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer ${blockBtnClass}" data-email="${user.email}">
          ${blockBtnText}
        </button>
        <button class="btn-delete-user rounded-full border border-red-200 dark:border-red-900/50 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer" data-email="${user.email}">
          Eliminar
        </button>
      </div>
    `;
  }

  return `
    <div class="rounded-2xl bg-blue-50 dark:bg-slate-800 p-4 border border-blue-100/50 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 transition">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <p class="font-bold text-slate-900 dark:text-slate-100">${user.name}</p>
            ${blockedBadge}
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">${user.email}</p>
        </div>
        <div class="flex items-center gap-3">
          ${roleBadge}
          ${actionButtons}
        </div>
      </div>
    </div>
  `;
}
