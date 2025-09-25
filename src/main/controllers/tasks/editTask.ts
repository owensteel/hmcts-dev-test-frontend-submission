import { TaskUpdateForm } from '../../../models/TaskUpdateForm';
import { TaskService } from '../../../services/TaskService';
import { generateTaskStatusSelectorOptions } from '../../util/commonViewHelpers';
import * as TaskViewHelpers from '../../util/taskViewHelpers';

import { Request, Response } from 'express';

const taskService = new TaskService();

export async function editTaskForm(req: Request, res: Response): Promise<void> {
  const { taskId, highlightedProperty } = req.params;

  // Check that the specified property to edit is valid
  if (!TaskViewHelpers.isValidEditTaskHighlightedProperty(highlightedProperty)) {
    res.status(500).render('error');
  } else {
    try {
      const taskToEdit = await taskService.get(parseInt(taskId));
      res.render('tasks/edit.njk', {
        taskId,
        errors: null,
        // Values to display in the input(s)
        valuesForInputs: {
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
        // Generate options for Task Status selector in Nunjucks
        taskStatusSelectorOptions: generateTaskStatusSelectorOptions(taskToEdit.status),
      });
    } catch (e) {
      res.status(404).render('not-found');
    }
  }
}

export async function editTaskAction(req: Request, res: Response): Promise<void> {
  const { taskId, highlightedProperty } = req.params;

  // Check that the specified property to edit is valid
  if (!TaskViewHelpers.isValidEditTaskHighlightedProperty(highlightedProperty)) {
    res.status(500).render('error');
  } else {
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
      return res.render('tasks/edit.njk', {
        taskId,
        errors: formValidationErrors,
        // Values to display in the inputs, will now reflect
        // user's submission by this point
        valuesForInputs: req.body,
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
        res.status(500).render('error');
      }
    }
  }
}
