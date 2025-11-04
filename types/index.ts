export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type Theme = 'light' | 'dark';