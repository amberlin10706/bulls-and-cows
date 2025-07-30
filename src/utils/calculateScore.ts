export function calculateScore({
  guesses,
  time,
}: {
  guesses: number;
  time: number;
}): number {
  // 每猜一次加10分
  // 每過10秒加1分
  return guesses * 10 + Math.floor(time / 10);
}
