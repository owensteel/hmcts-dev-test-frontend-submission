import { Case } from '../../models/Case';
import { ApiClient } from '../../services/ApiClient';

import { Application, Request, Response } from 'express';

export default function registerHomeRoute(app: Application): void {
  const apiClient = new ApiClient();

  app.get('/', async (req: Request, res: Response) => {
    try {
      // Get case details
      const caseData = await apiClient.getExampleCase();

      // Get tasks for this case
      const tasks = await apiClient.getTasksForCase(caseData.id);

      // Attach tasks to case object
      const fullCase: Case = { ...caseData, tasks };

      res.render('home', { case: fullCase });
    } catch (error) {
      // Show an error page instead of rendering empty home
      res.status(500).render('error');
    }
  });
}
