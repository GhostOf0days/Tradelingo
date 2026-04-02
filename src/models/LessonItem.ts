export interface LessonItem {
  title: string;
  content: string;
  question: { question: string; options: string[]; correctIndex: number };
  demo?: string;
}