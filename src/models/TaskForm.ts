import { TaskStatus } from '../models/TaskStatus';
import { ApiClient } from '../services/ApiClient';

import { Task } from './Task';

import { isAxiosError } from 'axios';

export class TaskForm {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  caseId: number;

  constructor(
    title: string,
    dueDate: string,
    status: TaskStatus = TaskStatus.TODO,
    caseId: number,
    description?: string,
    id?: number
  ) {
    this.title = title;
    this.dueDate = dueDate;
    this.status = status;
    this.caseId = caseId;
    this.description = description;
    this.id = id;
  }

  validateAndGetErrors(): { text: string; href: string }[] {
    const errors: { text: string; href: string }[] = [];

    const dueDate = new Date(this.dueDate);
    if (isNaN(dueDate.getTime()) || Date.now() > dueDate.getTime()) {
      errors.push({ text: 'Enter a valid due date in the future', href: '#due-date-time' });
    }

    if (!this.title || this.title.trim() === '') {
      errors.push({ text: 'Enter a task title', href: '#title' });
    }

    return errors;
  }

  async save(): Promise<Task> {
    if (this.validateAndGetErrors().length > 0) {
      throw new Error('Validation errors detected. Cannot be submitted.');
    }

    const apiClient = new ApiClient();
    try {
      return await apiClient.saveOrCreateTask(Number(this.caseId), {
        title: this.title,
        description: this.description || '',
        dueDateTime: new Date(this.dueDate).toISOString(),
      });
    } catch (e) {
      if (isAxiosError(e)) {
        throw e;
      }
      throw new Error(String(e));
    }
  }
}
