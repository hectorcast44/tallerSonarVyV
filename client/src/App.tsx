import React, { useState } from 'react';
import { Task } from './types';
import { TaskItem } from './components/TaskItem';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Configurar GitHub Actions',
      description: 'Pipeline de CI automatizado',
      completed: true,
    },
    {
      id: '2',
      title: 'Vincular SonarQube Cloud',
      description: 'Análisis estático y Quality Gates',
      completed: false,
    },
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
  };

  const handleToggle = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '16px' }}>
        <h1 style={{ margin: 0, color: '#1e3a8a' }}>Taller V&V: SonarQube Cloud</h1>
        <p style={{ color: '#4b5563', margin: '8px 0 0' }}>
          Gestión de Tareas con Aseguramiento de Calidad y Quality Gates
        </p>
        <p style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold' }}>
          Completadas: {completedCount} de {tasks.length}
        </p>
      </header>

      <form onSubmit={handleAddTask} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="text"
          placeholder="Título de la tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          aria-label="Título de la nueva tarea"
        />
        <input
          type="text"
          placeholder="Descripción (opcional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          aria-label="Descripción de la nueva tarea"
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Agregar Tarea
        </button>
      </form>

      <div style={{ marginTop: '24px' }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>No hay tareas registradas.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default App;
