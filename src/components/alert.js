export function AlertComponent(message, type = 'error') {
  const isError = type === 'error';
  const bgClass = isError 
    ? 'bg-red-50 dark:bg-red-950/25 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/40' 
    : 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40';

  return `
    <div class="text-sm font-semibold p-3 rounded-xl border ${bgClass} transition duration-150 ease-in-out">
      ${message}
    </div>
  `;
}
