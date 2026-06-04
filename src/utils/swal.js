import Swal from 'sweetalert2';

export const swalHelper = {
  getThemeOptions() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      background: isDark ? '#0f172a' : '#ffffff', // slate-900 or white
      color: isDark ? '#f8fafc' : '#0f172a',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[2rem] border border-blue-100 dark:border-slate-800 shadow-2xl p-8 transition-all',
        title: 'text-2xl font-black text-slate-900 dark:text-slate-100 font-sans tracking-tight',
        htmlContainer: 'text-sm text-slate-600 dark:text-slate-400 mt-2 font-sans',
        confirmButton: 'rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-300 dark:shadow-none hover:bg-blue-500 transition cursor-pointer mx-1 focus:outline-none focus:ring-2 focus:ring-blue-400',
        cancelButton: 'rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer mx-1 focus:outline-none focus:ring-2 focus:ring-blue-400'
      }
    };
  },

  success(title, text) {
    return Swal.fire({
      ...this.getThemeOptions(),
      title,
      text,
      icon: 'success'
    });
  },

  error(title, text) {
    const themeOpts = this.getThemeOptions();
    themeOpts.customClass.confirmButton = 'rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300 dark:shadow-none hover:bg-red-500 transition cursor-pointer mx-1 focus:outline-none focus:ring-2 focus:ring-red-400';
    return Swal.fire({
      ...themeOpts,
      title,
      text,
      icon: 'error'
    });
  },

  confirm(title, text, confirmButtonText = 'Confirmar', isDanger = false) {
    const themeOpts = this.getThemeOptions();
    if (isDanger) {
      themeOpts.customClass.confirmButton = 'rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-300 dark:shadow-none hover:bg-red-500 transition cursor-pointer mx-1 focus:outline-none focus:ring-2 focus:ring-red-400';
    }
    return Swal.fire({
      ...themeOpts,
      title,
      text,
      icon: isDanger ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancelar'
    });
  }
};
