import { createTaskAction, createTaskForm } from '../controllers/tasks/createTask';
import { deleteTaskAction, deleteTaskForm } from '../controllers/tasks/deleteTask';
import { editTaskAction, editTaskForm } from '../controllers/tasks/editTask';
import tasksIndex from '../controllers/tasks/tasksIndex';
import viewTask from '../controllers/tasks/viewTask';

import { Application } from 'express';

export default function registerTasksRoute(app: Application): void {
  // Tasks index
  app.get('/tasks', tasksIndex);

  // Task display
  app.get('/tasks/:taskId/view', viewTask);

  // Task deletion form
  app.get('/tasks/:taskId/delete', deleteTaskForm);

  // Handle deletion request
  app.post('/tasks/:taskId/delete', deleteTaskAction);

  // Task editing form
  app.get('/tasks/:taskId/edit/:highlightedProperty', editTaskForm);

  // Handle submit for Task edit form
  app.post('/tasks/:taskId/edit/:highlightedProperty', editTaskAction);

  // Task creation form
  app.get('/tasks/new', createTaskForm);

  // Handle submit for Task creation form
  app.post('/tasks/new', createTaskAction);
}
