// // ModuleDefinition
// import { QuizQuestion } from './QuizQuestion';
// import { LessonItem } from './LessonItem';

// export class ModuleDefinition {
//   id: number;
//   title: string;
//   experiencePoints: number;
//   lessons: LessonItem[];
//   pretest: QuizQuestion[];
//   posttest: QuizQuestion[];
//   isLocked: boolean;

//   constructor(raw: Record<string, unknown>) {
//     this.id = raw.moduleId as number;
//     this.title = raw.title as string;
//     this.experiencePoints = raw.experiencePoints as number;
//     this.isLocked = (raw.isLocked as boolean) ?? false;

//     const lessons = (raw.lessons as Record<string, unknown>[]) ?? [];
//     this.lessons = lessons.map((l) => {
//       const q = l.question as Record<string, unknown>;
//       return new LessonItem(
//         l.title as string,
//         l.content as string,
//         q.question as string,
//         q.options as string[],
//         q.correct as number,
//         l.demo as string | undefined,
//       );
//     });

//     const pretest = (raw.pretest as Record<string, unknown>[]) ?? [];
//     this.pretest = pretest.map(
//       (q) => new QuizQuestion(
//         q.question as string,
//         q.options as string[],
//         q.correct as number,
//         (q.explanation as string) ?? '',
//       )
//     );

//     const posttest = (raw.posttest as Record<string, unknown>[]) ?? [];
//     this.posttest = posttest.map(
//       (q) => new QuizQuestion(
//         q.question as string,
//         q.options as string[],
//         q.correct as number,
//         (q.explanation as string) ?? '',
//       )
//     );
//   }

//   getLessonCount(): number {
//     return this.lessons.length;
//   }

//   getPretestCount(): number {
//     return this.pretest.length;
//   }

//   unlock(): void {
//     this.isLocked = false;
//   }

//   getProgressPercent(currentStep: number, totalSteps: number): number {
//     if (totalSteps === 0) return 0;
//     return Math.round((currentStep / totalSteps) * 100);
//   }

//   calculateXpEarned(lessonXp: number): number {
//     return this.experiencePoints + this.lessons.length * lessonXp;
//   }
// }