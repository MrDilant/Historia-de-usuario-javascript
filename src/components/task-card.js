export function TaskCardComponent(task, showOwner = false) {
  let statusBadge = '';
  if (task.status === 'Completada') {
    statusBadge = '<span class="rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">COMPLETADA</span>';
  } else if (task.status === 'En progreso') {
    statusBadge = '<span class="rounded-full bg-amber-100 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">EN PROGRESO</span>';
  } else {
    statusBadge = '<span class="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">PENDIENTE</span>';
  }

  const ownerHtml = showOwner 
    ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-2">Propietario: <strong class="text-slate-700 dark:text-slate-300">${task.owner}</strong></p>` 
    : '';

  return `
    <article class="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg shadow-blue-50 dark:shadow-none hover:border-blue-200 dark:hover:border-slate-700 transition" data-id="${task.id}">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div class="flex items-center gap-3">
            ${statusBadge}
            ${task.date ? `<span class="text-xs text-slate-400 dark:text-slate-500 font-semibold">Límite: ${task.date}</span>` : ''}
          </div>
          <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">${task.title}</h2>
          <p class="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">${task.description || ''}</p>
          ${ownerHtml}
        </div>
        <div class="flex gap-3">
          <button class="btn-edit rounded-full border border-blue-200 dark:border-blue-900/50 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer" data-id="${task.id}">Editar</button>
          <button class="btn-delete rounded-full border border-red-200 dark:border-red-900/50 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition cursor-pointer" data-id="${task.id}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}
