import { Case } from '../../models/Case';
import { Task } from '../../models/Task';
import { ApiClient } from '../../services/ApiClient';

import { Application, Request, Response } from 'express';

export default function registerHomeRoute(app: Application): void {
  const apiClient = new ApiClient();

  app.get('/', async (req: Request, res: Response) => {
    try {
      // Get case details
      const caseData = await apiClient.getExampleCase();

      // Get tasks for this case
      const unsortedTasks: Task[] = await apiClient.getTasksForCase(caseData.id);

      // Sort tasks by dueDate ascending (soonest first)
      const sortedTasks = unsortedTasks.sort((a, b) => {
        const dateA = new Date(a.dueDateTime).getTime();
        const dateB = new Date(b.dueDateTime).getTime();
        return dateA - dateB;
      });

      // Attach tasks to case object
      const fullCase: Case = { ...caseData, tasks: sortedTasks };

      res.render('home', { case: fullCase });
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  });
}
