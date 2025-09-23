import { Task } from '../../models/Task';
import { TaskCreateForm } from '../../models/TaskCreateForm';
import { TaskPage } from '../../models/TaskPage';
import { TaskStatus } from '../../models/TaskStatus';
import { TaskUpdateForm } from '../../models/TaskUpdateForm';
import { ApiClient } from '../../services/ApiClient';
import { TaskService } from '../../services/TaskService';

import { Application } from 'express';

const TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES: Record<string, string> = {
  [TaskStatus.DONE]: 'Done',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.PENDING]: 'To do',
  [TaskStatus.BLOCKED]: 'Blocked',
};

export default function (app: Application): void {
  const apiClient = new ApiClient();
  const taskService = new TaskService();

  const presetCaseId = 1;

  // Tasks index
  app.get('/tasks', async (req, res) => {
    // Get query parameters (they come as strings, so cast)
    const page = req.query.page ? Number(req.query.page) : 0;
    const size = req.query.size ? Number(req.query.size) : 5;
    const sortBy = (req.query.sortBy as string) || 'dueDateTime';
    const direction = (req.query.direction as 'asc' | 'desc') || 'asc';

    // Get pre-sorted tasks for this case
    const taskPage: TaskPage<Task> = await apiClient.getTasksForCase(presetCaseId, page, size, sortBy, direction);

    // Precompute the list of numbered page links
    const paginationItems = [];
    for (let i = 0; i < taskPage.totalPages; i++) {
      paginationItems.push({
        number: i + 1,
        href: `/tasks/?page=${i}&sortBy=${sortBy}&direction=${direction}`,
        current: i === taskPage.number,
      });
    }

    res.render('../views/tasks/index.njk', {
      taskPage,
      totalPages: taskPage.totalPages,
      sortBy,
      direction,
      paginationItems,
    });
  });

  // Task display
  app.get('/tasks/:taskId/view', async (req, res) => {
    const { taskId } = req.params;

    try {
      const task = await taskService.get(parseInt(taskId));
      res.render('../views/tasks/view.njk', {
        task,
        taskStatusUserFriendly: TASK_STATUS_MAP_TO_USER_FRIENDLY_VALUES[task.status],
      });
    } catch (e) {
      res.status(500).render('error');
    }
  });

  // Task editing form
  app.get('/tasks/:taskId/edit/:highlightedProperty', async (req, res) => {
    const { taskId, highlightedProperty } = req.params;

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
        res.redirect('/tasks/' + taskId + '/view');
      } catch (error) {
        console.error(error);
        res.status(500).render('error');
      }
    }
  });

  // Task creation form
  app.get('/tasks/new', (req, res) => {
    res.render('../views/tasks/new.njk', {
      errors: null,
      values: {
        title: '',
        description: '',
      },
      presetCaseId,
    });
  });

  // Handle submit for Task creation form
  app.post('/tasks/new', async (req, res) => {
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
      return res.render('../views/tasks/new.njk', {
        errors: formValidationErrors,
        values: req.body,
      });
    } else {
      // Submit to backend
      try {
        await taskService.create(presetCaseId, taskCreateForm);
        // Redirect user to updated Tasks list
        res.redirect('/tasks');
      } catch (error) {
        // TODO: remove in prod
        console.error(error.response);
        // Show an error page instead of rendering empty home
        res.status(500).render('error');
      }
    }
  });
}
