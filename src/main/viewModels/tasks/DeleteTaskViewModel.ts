import { Task } from '../../../models/Task';

export interface DeleteTaskViewModel {
  taskId: number;
  originalValues: Task;
}
