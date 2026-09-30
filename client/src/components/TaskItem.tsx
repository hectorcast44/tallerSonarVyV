import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div
      data-testid={`task-item-${task.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        margin: '8px 0',
        borderRadius: '6px',
        backgroundColor: task.completed ? '#f0fdf4' : '#f9fafb',
        border: `1px solid ${task.completed ? '#86efac' : '#e5e7eb'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Marcar ${task.title}`}
        />
        <div>
          <strong
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#6b7280' : '#111827',
            }}
          >
            {task.title}
          </strong>
          {task.description && (
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        style={{
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '6px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        aria-label={`Eliminar ${task.title}`}
      >
        Eliminar
      </button>
    </div>
  );
};
