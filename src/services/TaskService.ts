import { Task, TaskCreate, TaskUpdate } from '../models/Task';
import { ApiClient } from '../services/ApiClient';

import { isAxiosError } from 'axios';

export class TaskService {
  private apiClient: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.apiClient = apiClient || new ApiClient();
  }

  async create(caseId: number, task: TaskCreate): Promise<Task> {
    try {
      return await this.apiClient.createTask(caseId, task);
    } catch (e) {
      if (isAxiosError(e)) {
        throw e;
      }
      throw new Error(String(e));
    }
  }

  async get(taskId: number): Promise<Task> {
    try {
      return await this.apiClient.getTask(taskId);
    } catch (e) {
      if (isAxiosError(e)) {
        throw e;
      }
      throw new Error(String(e));
    }
  }

  async update(taskId: number, updates: TaskUpdate): Promise<Task> {
    try {
      return await this.apiClient.updateTask(taskId, updates);
    } catch (e) {
      if (isAxiosError(e)) {
        throw e;
      }
      throw new Error(String(e));
    }
  }

  async delete(taskId: number): Promise<void> {
    try {
      await this.apiClient.deleteTask(taskId);
    } catch (e) {
      if (isAxiosError(e)) {
        throw e;
      }
      throw new Error(String(e));
    }
  }
}
