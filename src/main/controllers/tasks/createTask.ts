import { TaskCreate } from '../../../models/Task';
import { TaskStatus } from '../../../models/TaskStatus';
import { TaskService } from '../../../services/TaskService';
import { validateTaskCreateAndGetErrors } from '../../util/taskFormValidation';

import { Request, Response } from 'express';

const taskService = new TaskService();
const presetCaseId = 1;

export async function createTaskForm(req: Request, res: Response): Promise<void> {
  res.render('tasks/new.njk', {
    errors: null,
    valuesForInputs: {
      title: '',
      description: '',
    },
    presetCaseId,
  });
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
    return res.render('tasks/new.njk', {
      errors: formValidationErrors,
      valuesForInputs: req.body,
    });
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
