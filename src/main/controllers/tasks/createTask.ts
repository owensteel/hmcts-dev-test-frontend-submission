import { TaskCreate } from '../../../models/Task';
import { TaskStatus } from '../../../models/TaskStatus';
import { TaskService } from '../../../services/TaskService';
import { validateTaskCreateAndGetErrors } from '../../util/taskFormValidation';
import { CreateTaskViewModel } from '../../viewModels/tasks/CreateTaskViewModel';

import { Request, Response } from 'express';

const taskService = new TaskService();
const presetCaseId = 1;

export async function createTaskForm(req: Request, res: Response): Promise<void> {
  const createTaskViewModel: CreateTaskViewModel = {
    errors: null,
    // Empty as user will be creating these now
    valuesForInputs: {
      title: '',
      description: '',
    },
    caseId: presetCaseId,
  };
  res.render('tasks/new.njk', createTaskViewModel);
}

export async function createTaskAction(req: Request, res: Response): Promise<void> {
  const taskCreate: TaskCreate = {
    title: req.body.title,
    dueDateTime: `${req.body['due-date-time-year']}-${req.body['due-date-time-month'].padStart(2, '0')}-${req.body['due-date-time-day'].padStart(2, '0')}`,
    // We assume all new tasks are just "todo"
    status: TaskStatus.PENDING,
    caseId: presetCaseId,
    description: req.body.description,
  };

  // Stop and display validation errors, if any
  const formValidationErrors = validateTaskCreateAndGetErrors(taskCreate);
  if (formValidationErrors.length > 0) {
    const createTaskViewModel: CreateTaskViewModel = {
      errors: formValidationErrors,
      valuesForInputs: {
        title: req.body.title,
        description: req.body.description,
      },
      caseId: presetCaseId,
    };

    return res.render('tasks/new.njk', createTaskViewModel);
  } else {
    // Submit to backend
    try {
      await taskService.create(presetCaseId, taskCreate);
      // Redirect user to updated Tasks list
      res.redirect('/tasks');
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  }
}
