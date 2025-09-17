export interface Task {
    id: number;             // matches backend `@Id`
    caseId: number;         // foreign key to Case
    title: string;
    description?: string;
    status: string;         // e.g "todo", "in_progress", "done"
    dueDate?: string;       // ISO date string
    createdAt: string;      // ISO date string
    updatedAt?: string;
}
