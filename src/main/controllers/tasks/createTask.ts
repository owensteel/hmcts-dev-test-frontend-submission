import { TaskCreateForm } from '../../../models/TaskCreateForm';
import { TaskStatus } from '../../../models/TaskStatus';
import { TaskService } from '../../../services/TaskService';

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
  const taskCreateForm: TaskCreateForm = new TaskCreateForm(
    req.body.title,
    `${req.body['due-date-time-year']}-${req.body['due-date-time-month'].padStart(2, '0')}-${req.body['due-date-time-day'].padStart(2, '0')}`,
    // We assume all new tasks are just "todo"
    TaskStatus.PENDING,
    presetCaseId,
    req.body.description
    // Leave ID property blank so we create this task
    // and leave the ID generation to the backend
  );

  // Stop and display validation errors, if any
  const formValidationErrors = taskCreateForm.validateAndGetErrors();
  if (formValidationErrors.length > 0) {
    return res.render('tasks/new.njk', {
      errors: formValidationErrors,
      valuesForInputs: req.body,
    });
  } else {
    // Submit to backend
    try {
      await taskService.create(presetCaseId, taskCreateForm);
      // Redirect user to updated Tasks list
      res.redirect('/tasks');
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  }
}
