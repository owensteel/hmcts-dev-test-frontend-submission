import { Application } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  app.get('/', async (req: any, res: { render: (arg0: string, arg1: { example?: any; }) => void; }) => {
    try {
      const response = await axios.get('http://localhost:4000/api/cases/get-example-case');
      console.log(response.data);
      res.render('home', { "example": response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });
}
