import { ApiClient } from '../../services/ApiClient';

import { Application } from 'express';

export default function (app: Application): void {
  const apiClient = new ApiClient();

  // ID of the example case we're working with
  const caseId = 1;

  // Show the form
  app.get('/tasks/new', (req, res) => {
    res.render('../views/tasks/new.njk', {
      errors: null,
      values: {
        title: '',
        description: '',
      },
    });
  });

  // Handle form submit
  app.post('/tasks/new', async (req, res) => {
    const errors: { text: string; href: string }[] = [];
    const { title, description } = req.body;
    const dueDate = new Date(
      `${req.body['due-date-time-year']}-${req.body['due-date-time-month'].padStart(2, '0')}-${req.body['due-date-time-day'].padStart(2, '0')}`
    );

    if (!title || title.trim() === '') {
      errors.push({ text: 'Enter a task title', href: '#title' });
    }

    if (isNaN(dueDate.getTime()) || Date.now() > dueDate.getTime()) {
      errors.push({ text: 'Enter a valid due date in the future', href: '#due-date-time' });
    }

    if (errors.length > 0) {
      return res.render('../views/tasks/new.njk', {
        errors,
        values: req.body,
      });
    }

    try {
      await apiClient.createTask(Number(caseId), {
        title,
        description,
        dueDateTime: dueDate.toISOString(),
      });
      res.redirect('/');
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  });
}
