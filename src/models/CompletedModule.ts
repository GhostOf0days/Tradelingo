// What we show on the review screen — mirrors server payload fields where possible.
export interface CompletedModule {
  moduleId: number;
  title: string;
  completedDate: string;
  xpEarned: number;
  score: number;
  lessons: number;
}