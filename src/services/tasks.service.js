const API_URL = 'http://localhost:3000/tasks';

const DEFAULT_TASKS = [
  {
    id: 1,
    title: 'Definir arquitectura inicial',
    description: 'Documentar la estructura por capas y dejar claro el alcance base del proyecto.',
    status: 'Completada',
    date: '2026-06-05',
    owner: 'ana@taskflow.com'
  },
  {
    id: 2,
    title: 'Construir vistas iniciales',
    description: 'Crear las pantallas base del proyecto para explicar la futura navegación SPA.',
    status: 'En progreso',
    date: '2026-06-10',
    owner: 'ana@taskflow.com'
  }
];

export const tasksService = {
  async getTasks() {
    try {
      if (localStorage.getItem('dev_simulate_offline') === 'true') {
        throw new Error('Simulación de red offline activada por Desarrollador.');
      }
      const response = await fetch(API_URL);
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('Backend json-server no disponible. Usando almacenamiento local.');
    }
    
    let localTasks = localStorage.getItem('tasks_db');
    if (!localTasks) {
      localStorage.setItem('tasks_db', JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(localTasks);
  },

  async createTask(task) {
    try {
      if (localStorage.getItem('dev_simulate_offline') === 'true') {
        throw new Error('Simulación de red offline activada por Desarrollador.');
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('Backend json-server no disponible. Guardando en almacenamiento local.');
    }

    const tasks = await this.getTasks();
    const newTask = { ...task, id: Date.now() };
    tasks.push(newTask);
    localStorage.setItem('tasks_db', JSON.stringify(tasks));
    return newTask;
  },

  async updateTask(id, updatedTask) {
    try {
      if (localStorage.getItem('dev_simulate_offline') === 'true') {
        throw new Error('Simulación de red offline activada por Desarrollador.');
      }
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.warn('Backend json-server no disponible. Actualizando en almacenamiento local.');
    }

    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id == id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask, id: Number(id) };
      localStorage.setItem('tasks_db', JSON.stringify(tasks));
      return tasks[index];
    }
    return null;
  },

  async deleteTask(id) {
    try {
      if (localStorage.getItem('dev_simulate_offline') === 'true') {
        throw new Error('Simulación de red offline activada por Desarrollador.');
      }
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) return true;
    } catch (e) {
      console.warn('Backend json-server no disponible. Eliminando de almacenamiento local.');
    }

    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id != id);
    localStorage.setItem('tasks_db', JSON.stringify(filtered));
    return true;
  },

  async getTaskById(id) {
    try {
      if (localStorage.getItem('dev_simulate_offline') === 'true') {
        throw new Error('Simulación de red offline activada por Desarrollador.');
      }
      const response = await fetch(`${API_URL}/${id}`);
      if (response.ok) return await response.json();
    } catch (e) {
      // Fallback
    }
    const tasks = await this.getTasks();
    return tasks.find(t => t.id == id);
  }
};
