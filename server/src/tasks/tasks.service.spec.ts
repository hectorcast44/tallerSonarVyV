import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return initial list of tasks', () => {
      const result = service.findAll();
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0].title).toBe('Configurar GitHub Actions');
    });
  });

  describe('findOne', () => {
    it('should return a task by id when it exists', () => {
      const task = service.findOne('1');
      expect(task).toBeDefined();
      expect(task.id).toBe('1');
    });

    it('should throw NotFoundException when task does not exist', () => {
      expect(() => service.findOne('999')).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new task with description', () => {
      const task = service.create({
        title: 'Nueva Tarea',
        description: 'Detalle de prueba',
      });
      expect(task).toBeDefined();
      expect(task.title).toBe('Nueva Tarea');
      expect(task.description).toBe('Detalle de prueba');
      expect(task.completed).toBe(false);
      expect(service.findAll().some((t) => t.title === 'Nueva Tarea')).toBe(true);
    });

    it('should default description to empty string if omitted', () => {
      const task = service.create({
        title: 'Tarea sin descripcion',
      });
      expect(task.description).toBe('');
    });
  });

  describe('toggleComplete', () => {
    it('should toggle task completion status', () => {
      const initial = service.findOne('2');
      const previousState = initial.completed;
      const updated = service.toggleComplete('2');
      expect(updated.completed).toBe(!previousState);
    });
  });

  describe('remove', () => {
    it('should remove an existing task', () => {
      const initialCount = service.findAll().length;
      service.remove('1');
      expect(service.findAll().length).toBe(initialCount - 1);
      expect(() => service.findOne('1')).toThrow(NotFoundException);
    });

    it('should throw NotFoundException if task does not exist', () => {
      expect(() => service.remove('999')).toThrow(NotFoundException);
    });
  });
});
