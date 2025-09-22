import { TaskForm } from '../../models/TaskForm';
import { TaskStatus } from '../../models/TaskStatus';
import { TaskService } from '../../services/TaskService';

import { Application } from 'express';

export default function (app: Application): void {
  // ID of the example case we're working with
  // Fixed for this example scenario
  const caseId = 1;

  // Task creation form
  app.get('/tasks/new', (req, res) => {
    res.render('../views/tasks/new.njk', {
      errors: null,
      values: {
        title: '',
        description: '',
      },
    });
  });

  // Handle submit for Task creation form
  app.post('/tasks/new', async (req, res) => {
    const taskCreateForm: TaskForm = new TaskForm(
      req.body.title,
      `${req.body['due-date-time-year']}-${req.body['due-date-time-month'].padStart(2, '0')}-${req.body['due-date-time-day'].padStart(2, '0')}`,
      // We assume all new tasks are just "todo"
      TaskStatus.TODO,
      caseId,
      req.body.description
      // Leave ID property blank so we create this task
      // and leave the ID generation to the backend
    );

    // Stop and display validation errors, if any
    const formValidationErrors = taskCreateForm.validateAndGetErrors();
    if (formValidationErrors.length > 0) {
      return res.render('../views/tasks/new.njk', {
        errors: formValidationErrors,
        values: req.body,
      });
    }

    // Submit to backend
    const taskService = new TaskService();
    try {
      await taskService.create(caseId, taskCreateForm);
      res.redirect('/');
    } catch (error) {
      // TODO: remove in prod
      console.error(error.response);
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  });
}
