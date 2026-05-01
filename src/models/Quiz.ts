// quiz hub card metadata including reward size and question count.
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export default class Quiz {
  id: number;

  title: string;

  description: string;

  difficulty: Difficulty;

  category: string;

  private xpRewardValue: number;

  private questionCount: number;

  constructor(
    id: number,
    title: string,
    description: string,
    difficulty: Difficulty,
    category: string,
    xpReward: number,
    questions: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.category = category;
    this.xpRewardValue = xpReward;
    this.questionCount = questions;
  }

  get xpReward(): number {
    return this.xpRewardValue;
  }

  get questions(): number {
    return this.questionCount;
  }

  calculateXpEarned(score: number, totalQuestions: number): number {
    return Math.floor((score / totalQuestions) * this.xpRewardValue);
  }

  copyWith(
    updates: Partial<{
      xpReward: number;
      questions: number;
    }>
  ): Quiz {
    return new Quiz(
      this.id,
      this.title,
      this.description,
      this.difficulty,
      this.category,
      updates.xpReward ?? this.xpRewardValue,
      updates.questions ?? this.questionCount
    );
  }
}
