// copy the xp thresholds from UserContext so both sides agree on level.
export function calculateLevel(xp: number): number {
  if (xp < 1000) return 1;
  if (xp < 2500) return 2;
  if (xp < 4500) return 3;
  if (xp < 7000) return 4;
  if (xp < 10000) return 5;
  return 5 + Math.floor((xp - 10000) / 5000);
}
