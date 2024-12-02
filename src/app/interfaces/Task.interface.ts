export interface Task {
  id: number;
  title: string;
  description: string;
  time: string;
  date: Date; // Date type
  location: string;
  category: string[];
  image?: string; // ? means optional
}
