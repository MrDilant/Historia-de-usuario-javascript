import { NavbarComponent } from './navbar.js';

export function ShellLayout(contentHtml, maxWidthClass = 'max-w-6xl') {
  const navbarHtml = NavbarComponent();
  return `
    <div class="min-h-screen bg-sky-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      ${navbarHtml}
      
      <main class="mx-auto ${maxWidthClass} px-6 py-10 flex-1 w-full">
        ${contentHtml}
      </main>
    </div>
  `;
}
