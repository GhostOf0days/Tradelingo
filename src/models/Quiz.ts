export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export class Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  private _xpReward: number;
  private _questions: number;

  constructor(
    id: number,
    title: string,
    description: string,
    difficulty: Difficulty,
    category: string,
    xpReward: number,
    questions: number,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.category = category;
    this._xpReward = xpReward;
    this._questions = questions;
  }

  get xpReward(): number {
    return this._xpReward;
  }

  get questions(): number {
    return this._questions;
  }

  calculateXpEarned(score: number, totalQuestions: number): number {
    return Math.floor((score / totalQuestions) * this._xpReward);
  }

  copyWith(
    updates: Partial<{
      xpReward: number;
      questions: number;
    }>,
  ): Quiz {
    return new Quiz(
      this.id,
      this.title,
      this.description,
      this.difficulty,
      this.category,
      updates.xpReward ?? this._xpReward,
      updates.questions ?? this._questions,
    );
  }
}