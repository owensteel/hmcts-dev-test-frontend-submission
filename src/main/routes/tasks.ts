import { TaskCreateForm } from '../../models/TaskCreateForm';
import { TaskStatus } from '../../models/TaskStatus';
import { TaskUpdateForm } from '../../models/TaskUpdateForm';
import { TaskService } from '../../services/TaskService';

import { Application } from 'express';

export default function (app: Application): void {
  const taskService = new TaskService();

  // Task display
  app.get('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    // Check task ID is valid
    if (isNaN(parseInt(taskId))) {
      res.redirect('/');
    }

    try {
      const task = await taskService.get(parseInt(taskId));
      res.render('../views/tasks/view.njk', { task });
    } catch (e) {
      res.redirect('/');
    }
  });

  // Task editing form
  app.get('/tasks/:taskId/edit/:highlightedProperty', async (req, res) => {
    const { taskId, highlightedProperty } = req.params;

    // Check task ID is valid
    if (isNaN(parseInt(taskId))) {
      res.redirect('/');
    }

    const taskToEdit = await taskService.get(parseInt(taskId));
    res.render('../views/tasks/edit.njk', {
      taskId,
      errors: null,
      // Values to display in the input(s)
      values: {
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
      },
      // Original values that will remain as
      // what is actually in the database
      originalValues: {
        title: taskToEdit.title,
      },
      highlightedProperty,
    });
  });

  // Handle submit for Task edit form
  app.post('/tasks/:taskId/edit/:highlightedProperty', async (req, res) => {
    const { taskId, highlightedProperty } = req.params;

    const taskUpdateForm: TaskUpdateForm = new TaskUpdateForm();
    // Add properties to form depending on what is submitted
    if ('title' in req.body) {
      taskUpdateForm.title = req.body.title;
    }
    if ('description' in req.body) {
      taskUpdateForm.description = req.body.description;
    }
    if ('status' in req.body) {
      taskUpdateForm.status = req.body.status;
    }
    if ('due-date-time-year' in req.body && 'due-date-time-month' in req.body && 'due-date-time-day' in req.body) {
      const dateInputsCombined = `${req.body['due-date-time-year']}-${req.body['due-date-time-month'].padStart(2, '0')}-${req.body['due-date-time-day'].padStart(2, '0')}`;
      taskUpdateForm.dueDateTime = dateInputsCombined;
    }

    // Stop and display validation errors, if any
    const formValidationErrors = taskUpdateForm.validateAndGetErrors();
    if (formValidationErrors.length > 0) {
      // Make sure original values are up-to-date
      const taskToEdit = await taskService.get(parseInt(taskId));
      return res.render('../views/tasks/edit.njk', {
        taskId,
        errors: formValidationErrors,
        // Values to display in the inputs, will now reflect
        // user's submission by this point
        values: req.body,
        // Original values, what the task's data currently is
        originalValues: {
          title: taskToEdit.title,
        },
        highlightedProperty,
      });
    } else {
      // Submit to backend
      try {
        await taskService.update(Number(taskId), taskUpdateForm);
        res.redirect('/');
      } catch (error) {
        console.error(error);
        res.status(500).render('error');
      }
    }
  });

  // Task creation form
  app.get('/tasks/new/:caseId', (req, res) => {
    const { caseId } = req.params;
    res.render('../views/tasks/new.njk', {
      errors: null,
      values: {
        title: '',
        description: '',
      },
      caseId,
    });
  });

  // Handle submit for Task creation form
  app.post('/tasks/new/:caseIdParam', async (req, res) => {
    const { caseIdParam } = req.params;

    // Check specified Case ID is valid
    if (isNaN(parseInt(caseIdParam))) {
      res.status(404).render('error');
    }
    const caseId = parseInt(caseIdParam);

    const taskCreateForm: TaskCreateForm = new TaskCreateForm(
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
    } else {
      // Submit to backend
      try {
        await taskService.create(caseId, taskCreateForm);
        res.redirect('/');
      } catch (error) {
        // TODO: remove in prod
        console.error(error.response);
        // Show an error page instead of rendering empty home
        res.status(500).render('error');
      }
    }
  });
}
