export class QuizQuestion {
  question: string;
  options: string[];
  private _correct: number;
  explanation: string;

  constructor(
    question: string,
    options: string[],
    correct: number,
    explanation: string = '',
  ) {
    this.question = question;
    this.options = options;
    this._correct = correct;
    this.explanation = explanation;
  }

  get correct(): number {
    return this._correct;
  }

  isCorrectAnswer(index: number): boolean {
    return index === this._correct;
  }

  getCorrectAnswer(): string {
    return this.options[this._correct];
  }
}