import { Task, TaskCreate } from '../models/Task';
import { ApiClient } from '../services/ApiClient';

import { isAxiosError } from 'axios';

export class TaskService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async create(caseId: number, task: TaskCreate): Promise<Task> {
    try {
      return await this.apiClient.saveOrCreateTask(caseId, {
        title: task.title,
        description: task.description || '',
        dueDateTime: new Date(task.dueDateTime).toISOString(),
      });
    } catch (e) {
      if (isAxiosError(e)) {
        throw e;
      }
      throw new Error(String(e));
    }
  }
}
