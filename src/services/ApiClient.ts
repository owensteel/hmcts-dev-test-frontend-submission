import { Case } from '../models/Case';
import { Task, TaskUpdate } from '../models/Task';
import { TaskPage } from '../models/TaskPage';

import axios, { AxiosInstance } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.API_URL || 'http://localhost:4000/api') {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async getCase(caseId: string): Promise<Case> {
    const { data } = await this.client.get<Case>(`/cases/${caseId}`);
    return data;
  }

  async getExampleCase(): Promise<Case> {
    const { data } = await this.client.get<Case>('/cases/get-example-case');
    return data;
  }

  async getTasksForCase(
    caseId: number,
    page = 0,
    size = 5,
    sortBy = 'dueDateTime',
    direction = 'asc',
    statusFilter = 'ANY'
  ): Promise<TaskPage<Task>> {
    const response = await this.client.get(`/cases/${caseId}/tasks`, {
      params: { page, size, sortBy, direction, statusFilter },
    });
    return response.data;
  }

  async createTask(
    caseId: number,
    taskData: {
      title: string;
      description: string;
      dueDateTime: string;
    }
  ): Promise<Task> {
    const response = await this.client.post(`/cases/${caseId}/tasks`, taskData);
    return response.data;
  }

  async getTask(taskId: number): Promise<Task> {
    const { data } = await this.client.get<Task>(`/tasks/${taskId}`);
    return data;
  }

  async updateTask(taskId: number, updates: TaskUpdate): Promise<Task> {
    const response = await this.client.put<Task>(`/tasks/${taskId}`, updates);
    return response.data;
  }
}
