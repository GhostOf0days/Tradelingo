/** Fisher–Yates shuffle of multiple-choice options; returns a new order and the updated correct index. */
export function shuffleQuestionOptions(
  options: readonly string[],
  correctIndex: number,
): { options: string[]; correctIndex: number } {
  const n = options.length;
  if (n <= 1) {
    return { options: [...options], correctIndex };
  }
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const shuffled = order.map((i) => options[i]);
  const newCorrect = order.indexOf(correctIndex);
  return { options: shuffled, correctIndex: newCorrect };
}
