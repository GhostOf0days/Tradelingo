// Class representing a quiz question
export class QuizQuestion {
  question: string;
  options: string[];
  private _correct: number;

  constructor(
    question: string,
    options: string[],
    correct: number,
  ) {
    this.question = question;
    this.options = options;
    this._correct = correct;
  }

  get correct(): number {
    return this._correct;
  }

  isCorrectAnswer(index: number): boolean {
    return index === this._correct;
  }
}