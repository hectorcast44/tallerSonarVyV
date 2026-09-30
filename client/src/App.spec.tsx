import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders title and initial tasks', () => {
    render(<App />);

    expect(screen.getByText('Taller V&V: SonarQube Cloud')).toBeInTheDocument();
    expect(screen.getByText('Configurar GitHub Actions')).toBeInTheDocument();
    expect(screen.getByText('Vincular SonarQube Cloud')).toBeInTheDocument();
    expect(screen.getByText(/Completadas: 1 de 2/)).toBeInTheDocument();
  });

  it('allows adding a new task', () => {
    render(<App />);

    const titleInput = screen.getByLabelText('Título de la nueva tarea');
    const descInput = screen.getByLabelText('Descripción de la nueva tarea');
    const submitBtn = screen.getByRole('button', { name: /Agregar Tarea/i });

    fireEvent.change(titleInput, { target: { value: 'Nueva Tarea Test' } });
    fireEvent.change(descInput, { target: { value: 'Detalle de prueba' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Nueva Tarea Test')).toBeInTheDocument();
    expect(screen.getByText('Detalle de prueba')).toBeInTheDocument();
  });

  it('does not add task if title is empty or only whitespace', () => {
    render(<App />);

    const titleInput = screen.getByLabelText('Título de la nueva tarea');
    const submitBtn = screen.getByRole('button', { name: /Agregar Tarea/i });

    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Completadas: 1 de 2/)).toBeInTheDocument();
  });

  it('allows toggling task completion state', () => {
    render(<App />);

    const checkbox = screen.getByLabelText('Marcar Vincular SonarQube Cloud');
    fireEvent.click(checkbox);

    expect(screen.getByText(/Completadas: 2 de 2/)).toBeInTheDocument();
  });

  it('allows deleting a task', () => {
    render(<App />);

    const deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText('Configurar GitHub Actions')).not.toBeInTheDocument();
  });

  it('shows empty state message when all tasks are deleted', () => {
    render(<App />);

    let deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });
    fireEvent.click(deleteButtons[0]);

    deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('No hay tareas registradas.')).toBeInTheDocument();
  });
});
