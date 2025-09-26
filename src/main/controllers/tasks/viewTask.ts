import { TaskService } from '../../../services/TaskService';
import * as TaskViewHelpers from '../../util/taskViewHelpers';
import { ViewTaskViewModel } from '../../viewModels/tasks/ViewTaskViewModel';

import { Request, Response } from 'express';

const taskService = new TaskService();

export default async function viewTask(req: Request, res: Response): Promise<void> {
  const { taskId } = req.params;

  try {
    const task = await taskService.get(parseInt(taskId));

    const viewTaskViewModel: ViewTaskViewModel = {
      task,
      taskStatusUserFriendly: {
        text: TaskViewHelpers.getStatusUserFriendlyLabel(task.status),
        statusTagClass: TaskViewHelpers.getStatusTagClass(task.status),
      },
    };

    res.render('tasks/view.njk', viewTaskViewModel);
  } catch (e) {
    if (e.response.status && e.response.status === 404) {
      // Handling 404s is particularly important for this
      // page, as we definitely want the user to know if the
      // task they're looking for doesn't exist
      res.status(404).render('not-found');
    } else {
      // Generic error
      res.status(500).render('error');
    }
  }
}
