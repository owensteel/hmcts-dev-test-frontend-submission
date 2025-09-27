export interface TaskPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** The amount of items requested per page */
  size: number;
  /** The page index (0-index) */
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
