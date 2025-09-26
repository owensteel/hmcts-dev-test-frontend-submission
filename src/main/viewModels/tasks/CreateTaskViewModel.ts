import { validationError } from '../../util/taskFormValidation';

export interface CreateTaskViewModel {
  errors: validationError[] | null;
  valuesForInputs: {
    title: string;
    description: string;
  };
  caseId: number;
}
