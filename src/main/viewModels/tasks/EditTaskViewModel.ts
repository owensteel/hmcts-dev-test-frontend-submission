import { Task } from '../../../models/Task';
import { NunjucksSelectorOption } from '../../util/commonViewHelpers';
import { validationError } from '../../util/taskFormValidation';

export interface EditTaskViewModel {
  taskId: number;
  errors: validationError[] | null;
  valuesForInputs: {
    title: string;
    description: string;
    status: string;
  };
  originalValues: Task;
  highlightedProperty: string;
  taskStatusSelectorOptions: NunjucksSelectorOption[];
}
