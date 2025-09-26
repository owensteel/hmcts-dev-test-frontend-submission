import { TaskService } from '../../../services/TaskService';
import { DeleteTaskViewModel } from '../../viewModels/tasks/DeleteTaskViewModel';

import { Request, Response } from 'express';

const taskService = new TaskService();

export async function deleteTaskForm(req: Request, res: Response): Promise<void> {
  const { taskId } = req.params;

  try {
    const taskToEdit = await taskService.get(parseInt(taskId));

    const deleteTaskFormViewModel: DeleteTaskViewModel = {
      taskId: parseInt(taskId),
      originalValues: taskToEdit,
    };

    res.render('tasks/delete.njk', deleteTaskFormViewModel);
  } catch (e) {
    res.status(404).render('not-found');
  }
}

export async function deleteTaskAction(req: Request, res: Response): Promise<void> {
  const { taskId } = req.params;
  try {
    await taskService.delete(parseInt(taskId));
    res.redirect('/tasks');
  } catch (e) {
    res.status(500).render('error');
  }
}
