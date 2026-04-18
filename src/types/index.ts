// Shared TypeScript shapes for the learning app (modules, quizzes, explore, etc.).
// Keeping them here avoids circular imports between pages and data files.

export type PretestQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type QuizQuestion = PretestQuestion & {
  explanation?: string;
};

export type InteractiveDemo = {
  id: string;
  type: 'chart' | 'animation' | 'simulation';
  title: string;
  data: object;
};

export type LessonItem = {
  title: string;
  content: string;
  question: PretestQuestion;
  interactiveDemo?: InteractiveDemo;
};

export type ModuleDefinition = {
  id: number;
  title: string;
  experiencePoints: number;
  lessons: LessonItem[];
  pretest: PretestQuestion[];
  posttest?: PretestQuestion[];
  isLocked?: boolean;
};

export type ModuleProgress = {
  lessonCurrent: number;
  pretestScore?: number;
  posttestScore?: number;
  mistakeQuestionIds?: number[];
  streakBonus?: number;
};

export type CompletedModule = {
  moduleId: number;
  title: string;
  description: string;
  completedDate: string;
  xpEarned: number;
  score: number;
  lessons: number;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
};

export type User = {
  email: string;
  displayName: string;
  experiencePoints: number;
  level?: number;
  streakDays?: number;
  lastActivityDate?: string;
  lastUnlockedModuleId?: number;
  themePreference?: 'light' | 'dark';
  notificationsEnabled?: boolean;
  progressByModuleId?: Record<string, ModuleProgress>;
  completedModules?: CompletedModule[];
  badges?: Badge[];
  createdAt?: Date;
};

export type Quiz = {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  questionCount: number;
  category: string;
  questions?: QuizQuestion[];
};

export type LightningRoundQuestion = QuizQuestion & {
  category: string;
};

export type GameState = 'lobby' | 'countdown' | 'playing' | 'finished';

export type Article = {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  readTime: string;
  likes: number;
  url: string;
};

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  source: 'module' | 'article' | 'quiz';
  category: string;
};
