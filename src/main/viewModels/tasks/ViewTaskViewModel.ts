import { Task } from '../../../models/Task';

export interface ViewTaskViewModel {
  task: Task;
  taskStatusUserFriendly: {
    text: string;
    statusTagClass: string;
  };
}
