import { Task } from './Task';

export interface Case {
  id: number; // matches backend `@Id`
  title: string; // example field — adjust to match your backend
  description?: string;
  status: string; // e.g "open", "closed"
  createdAt: string; // ISO date string from backend
  updatedAt?: string;

  // Relationships
  tasks?: Task[]; // tasks belonging to this case
}
