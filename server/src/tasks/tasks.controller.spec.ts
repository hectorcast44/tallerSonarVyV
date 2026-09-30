import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
  };

  const mockTasksService = {
    findAll: jest.fn().mockReturnValue([mockTask]),
    findOne: jest.fn().mockReturnValue(mockTask),
    create: jest.fn().mockReturnValue(mockTask),
    toggleComplete: jest.fn().mockReturnValue({ ...mockTask, completed: true }),
    remove: jest.fn().mockReturnValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of tasks', () => {
      const result = controller.findAll();
      expect(result).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return single task', () => {
      const result = controller.findOne('1');
      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create task', () => {
      const dto = { title: 'New task', description: 'Desc' };
      const result = controller.create(dto);
      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle task status', () => {
      const result = controller.toggleComplete('1');
      expect(result.completed).toBe(true);
      expect(service.toggleComplete).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove task', () => {
      expect(() => controller.remove('1')).not.toThrow();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
