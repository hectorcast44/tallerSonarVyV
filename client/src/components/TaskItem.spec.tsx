import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskItem } from './TaskItem';
import { Task } from '../types';

describe('TaskItem component', () => {
  const sampleTask: Task = {
    id: '1',
    title: 'Aprender SonarQube',
    description: 'Comprender Quality Gates',
    completed: false,
  };

  it('renders task title and description', () => {
    render(<TaskItem task={sampleTask} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Aprender SonarQube')).toBeInTheDocument();
    expect(screen.getByText('Comprender Quality Gates')).toBeInTheDocument();
  });

  it('renders task without description gracefully', () => {
    const taskWithoutDesc = { ...sampleTask, description: '' };
    render(<TaskItem task={taskWithoutDesc} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Aprender SonarQube')).toBeInTheDocument();
    expect(screen.queryByText('Comprender Quality Gates')).not.toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggleMock = vi.fn();
    render(<TaskItem task={sampleTask} onToggle={onToggleMock} onDelete={vi.fn()} />);

    const checkbox = screen.getByLabelText('Marcar Aprender SonarQube');
    fireEvent.click(checkbox);

    expect(onToggleMock).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(<TaskItem task={sampleTask} onToggle={vi.fn()} onDelete={onDeleteMock} />);

    const deleteBtn = screen.getByRole('button', { name: /Eliminar/i });
    fireEvent.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });

  it('applies completed styles when task is completed', () => {
    const completedTask: Task = { ...sampleTask, completed: true };
    render(<TaskItem task={completedTask} onToggle={vi.fn()} onDelete={vi.fn()} />);

    const title = screen.getByText('Aprender SonarQube');
    expect(title).toHaveStyle('text-decoration: line-through');
  });
});
