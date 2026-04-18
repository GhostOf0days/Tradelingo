// Shape of one lesson inside src/data/* — content, inline quiz, optional demo id for DemoRegistry.
export interface LessonItem {
  title: string;
  content: string;
  question: { question: string; options: string[]; correctIndex: number };
  demo?: string;
}