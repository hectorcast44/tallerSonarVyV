import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Configurar GitHub Actions',
      description: 'Pipeline base de integración continua',
      completed: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Integrar SonarQube Cloud',
      description: 'Análisis estático de código y Quality Gate',
      completed: false,
      createdAt: new Date(),
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const newTask: Task = {
      id: String(this.tasks.length + 1),
      title: createTaskDto.title,
      description: createTaskDto.description ?? '',
      completed: false,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  toggleComplete(id: string): Task {
    const task = this.findOne(id);
    task.completed = !task.completed;
    return task;
  }

  remove(id: string): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    this.tasks.splice(index, 1);
  }
}
