// Thin wrapper around a multiple-choice item: keeps the correct index private-ish and helpers for UI.
export default class QuizQuestion {
  question: string;

  options: string[];

  private correctIndex: number;

  explanation: string;

  constructor(question: string, options: string[], correct: number, explanation: string = '') {
    this.question = question;
    this.options = options;
    this.correctIndex = correct;
    this.explanation = explanation;
  }

  get correct(): number {
    return this.correctIndex;
  }

  /** Used by Lightning Round and quiz UIs to compare a selected index to the key. */
  isCorrectAnswer(index: number): boolean {
    return index === this.correctIndex;
  }

  getCorrectAnswer(): string {
    return this.options[this.correctIndex];
  }
}
