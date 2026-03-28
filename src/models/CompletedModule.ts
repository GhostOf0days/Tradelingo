// Interface for a completed module
export interface CompletedModule {
  moduleId: number;
  title: string;
  completedDate: string;
  xpEarned: number;
  score: number;
  lessons: number;
}