import { TaskUpdate } from '../../../models/Task';
import { TaskService } from '../../../services/TaskService';
import { generateTaskStatusSelectorOptions } from '../../util/commonViewHelpers';
import { validateTaskUpdateAndGetErrors } from '../../util/taskFormValidation';
import * as TaskViewHelpers from '../../util/taskViewHelpers';
import { EditTaskViewModel } from '../../viewModels/tasks/EditTaskViewModel';

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

      const editTaskViewModel: EditTaskViewModel = {
        taskId: parseInt(taskId),
        errors: null,
        // Values to display in the input(s)
        valuesForInputs: {
          title: taskToEdit.title,
          description: taskToEdit.description || '',
          status: taskToEdit.status,
        },
        // Original values that will remain as
        // what is actually in the database
        originalValues: taskToEdit,
        highlightedProperty,
        taskStatusSelectorOptions: generateTaskStatusSelectorOptions(taskToEdit.status),
      };

      res.render('tasks/edit.njk', editTaskViewModel);
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
    const taskUpdate: TaskUpdate = {};
    // Add properties to form depending on what is submitted
    if ('title' in req.body) {
      taskUpdate.title = req.body.title;
    }
    if ('description' in req.body) {
      taskUpdate.description = req.body.description;
    }
    if ('status' in req.body) {
      taskUpdate.status = req.body.status;
    }
    if ('due-date-time-year' in req.body && 'due-date-time-month' in req.body && 'due-date-time-day' in req.body) {
      const dateInputsCombined = `${req.body['due-date-time-year']}-${req.body['due-date-time-month'].padStart(2, '0')}-${req.body['due-date-time-day'].padStart(2, '0')}`;
      taskUpdate.dueDateTime = dateInputsCombined;
    }

    // Stop and display validation errors, if any
    const formValidationErrors = validateTaskUpdateAndGetErrors(taskUpdate);
    if (formValidationErrors.length > 0) {
      // Make sure original values are up-to-date
      const taskToEdit = await taskService.get(parseInt(taskId));

      const editTaskViewModel: EditTaskViewModel = {
        taskId: parseInt(taskId),
        errors: formValidationErrors,
        valuesForInputs: {
          title: req.body.title || '',
          description: req.body.description || '',
          status: req.body.status || '',
        },
        originalValues: taskToEdit,
        highlightedProperty,
        taskStatusSelectorOptions: generateTaskStatusSelectorOptions(taskToEdit.status),
      };

      return res.render('tasks/edit.njk', editTaskViewModel);
    } else {
      // Submit to backend
      try {
        await taskService.update(Number(taskId), taskUpdate);
        res.redirect('/tasks/' + taskId + '/view');
      } catch (error) {
        res.status(500).render('error');
      }
    }
  }
}
