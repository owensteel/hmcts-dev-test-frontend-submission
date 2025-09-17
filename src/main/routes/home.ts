import { Application } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  app.get('/', async (req: any, res: {
    render: (arg0: string, arg1: {
      case?: any;
      tasks?: any;
    }) => void;
  }) => {
    try {
      const caseDetailsResponse = await axios.get('http://localhost:4000/api/cases/get-example-case');
      const caseTasksResponse = await axios.get(`http://localhost:4000/api/cases/${caseDetailsResponse.data.id}/tasks`);
      res.render(
        'home',
        {
          case: caseDetailsResponse.data,
          tasks: caseTasksResponse.data
        }
      );
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });
}
